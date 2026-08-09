import { createClient } from "@/lib/supabase/server";
import type { Birthday } from "@/types/birthday";

type BirthdayRow = {
  id: string;
  name: string;
  email: string;
  birth_month: number;
  birth_day: number;
  birth_year: number | null;
  avatar_url: string | null;
};

function toBirthday(row: BirthdayRow): Birthday {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    birthMonth: row.birth_month,
    birthDay: row.birth_day,
    birthYear: row.birth_year ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
  };
}

export async function getBirthdays(): Promise<Birthday[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("birthdays")
    .select("id, name, email, birth_month, birth_day, birth_year, avatar_url");

  if (error) {
    throw new Error(`Falha ao buscar aniversariantes: ${error.message}`);
  }

  return (data ?? []).map(toBirthday);
}
