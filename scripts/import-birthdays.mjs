import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const NAME_HEADERS = ["nome completo"];
const EMAIL_HEADERS = ["e-mail corporativo", "email corporativo"];
const DATE_HEADERS = ["data de nascimento"];
const PHOTO_HEADERS = ["foto de perfil"];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function findColumn(headers, candidates) {
  return headers.findIndex((h) => candidates.includes(h.trim().toLowerCase()));
}

function parseDate(value) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) return null;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;
  return { day, month, year };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function driveAvatarUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return { url: null, invalid: false };

  const fileId = /[?&]id=([^&\s]+)/.exec(trimmed)?.[1] ?? /\/d\/([^/\s]+)/.exec(trimmed)?.[1];
  if (!fileId) return { url: null, invalid: true };

  return { url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w512`, invalid: false };
}

function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Uso: npm run import:birthdays -- <caminho-do-csv>");
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar no .env.local.",
    );
    process.exit(1);
  }

  const rows = parseCsv(readFileSync(csvPath, "utf-8"));
  const [headerRow, ...dataRows] = rows;
  if (!headerRow) {
    console.error("CSV vazio.");
    process.exit(1);
  }

  const nameIdx = findColumn(headerRow, NAME_HEADERS);
  const emailIdx = findColumn(headerRow, EMAIL_HEADERS);
  const dateIdx = findColumn(headerRow, DATE_HEADERS);
  const photoIdx = findColumn(headerRow, PHOTO_HEADERS);
  if (nameIdx === -1 || emailIdx === -1 || dateIdx === -1) {
    console.error(
      `Não encontrei as colunas esperadas no CSV. Cabeçalhos lidos: ${headerRow.join(" | ")}`,
    );
    process.exit(1);
  }
  if (photoIdx === -1) {
    console.log('Coluna "Foto de Perfil" não encontrada — importando sem foto.');
  }

  const valid = [];
  const invalid = [];
  const warnings = [];

  dataRows.forEach((row, i) => {
    const lineNumber = i + 2; // +1 header, +1 índice 1-based
    const name = (row[nameIdx] ?? "").trim();
    const email = (row[emailIdx] ?? "").trim().toLowerCase();
    const dateValue = (row[dateIdx] ?? "").trim();
    const photoValue = photoIdx === -1 ? "" : (row[photoIdx] ?? "");

    if (!name) {
      invalid.push({ lineNumber, reason: "nome vazio" });
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      invalid.push({ lineNumber, reason: `e-mail inválido: "${email}"` });
      return;
    }
    const date = parseDate(dateValue);
    if (!date) {
      invalid.push({ lineNumber, reason: `data inválida: "${dateValue}"` });
      return;
    }
    const { url: avatarUrl, invalid: badPhoto } = driveAvatarUrl(photoValue);
    if (badPhoto) {
      warnings.push({ lineNumber, reason: `link de foto não reconhecido: "${photoValue}"` });
    }

    valid.push({
      name,
      email,
      birth_day: date.day,
      birth_month: date.month,
      birth_year: date.year,
      avatar_url: avatarUrl,
    });
  });

  if (invalid.length > 0) {
    console.log(`${invalid.length} linha(s) ignorada(s):`);
    invalid.forEach(({ lineNumber, reason }) => console.log(`  linha ${lineNumber}: ${reason}`));
  }
  if (warnings.length > 0) {
    console.log(`${warnings.length} aviso(s) (importado(s) sem foto):`);
    warnings.forEach(({ lineNumber, reason }) => console.log(`  linha ${lineNumber}: ${reason}`));
  }

  if (valid.length === 0) {
    console.log("Nenhum registro válido para importar.");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  supabase
    .from("birthdays")
    .upsert(valid, { onConflict: "email" })
    .select("id, email")
    .then(({ data, error }) => {
      if (error) {
        console.error("Falha ao importar:", error.message);
        process.exit(1);
      }
      console.log(`${data.length} registro(s) importado(s)/atualizado(s) com sucesso.`);
    });
}

main();
