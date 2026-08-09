import Image from "next/image";
import { Cake, Sparkles } from "lucide-react";
import { getBirthdays } from "@/features/birthdays/queries";
import { withProximity, groupByProximity } from "@/features/birthdays/utils";
import { FeaturedBirthdayCard } from "@/components/featured-birthday-card";
import { BirthdayCard } from "@/components/birthday-card";
import { BirthdayChip } from "@/components/birthday-chip";

export default async function Home() {
  const today = new Date();
  const allBirthdays = await getBirthdays();
  const withDays = withProximity(allBirthdays, today);
  const { today: todayBirthdays, upcoming, later } = groupByProximity(withDays);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-10 px-6 py-12">
      <header className="flex items-center gap-3">
        <Image
          src="/brand/mbm-logo.png"
          alt="MBM Solutions"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-lg font-semibold text-foreground">MBM - Feliz Dia</h1>
          <p className="text-sm text-muted">Aniversariantes do time</p>
        </div>
      </header>

      {withDays.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-10 text-center">
          <Cake className="h-8 w-8 text-muted" />
          <p className="text-muted">Nenhum aniversariante cadastrado ainda.</p>
        </div>
      )}

      {todayBirthdays.length > 0 && (
        <section className="flex flex-col gap-4">
          {todayBirthdays.map((birthday, index) => (
            <FeaturedBirthdayCard key={birthday.id} birthday={birthday} index={index} />
          ))}
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Próximos aniversários
          </h2>
          <ul className="flex flex-col gap-3">
            {upcoming.map((birthday, index) => (
              <BirthdayCard key={birthday.id} birthday={birthday} index={index} />
            ))}
          </ul>
        </section>
      )}

      {later.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            <Cake className="h-3.5 w-3.5 text-brand" />
            Mais adiante
          </h2>
          <ul className="flex flex-wrap gap-2">
            {later.map((birthday, index) => (
              <BirthdayChip key={birthday.id} birthday={birthday} index={index} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
