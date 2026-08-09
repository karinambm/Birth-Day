"use client";

import { motion } from "framer-motion";
import { Cake } from "lucide-react";
import { Avatar } from "@/components/avatar";
import {
  daysUntilLabel,
  formatFullDate,
  type BirthdayWithProximity,
} from "@/features/birthdays/utils";

type BirthdayCardProps = {
  birthday: BirthdayWithProximity;
  index: number;
};

export function BirthdayCard({ birthday, index }: BirthdayCardProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-soft transition-colors hover:border-brand/30 hover:bg-surface-hover hover:shadow-glow"
    >
      <Avatar name={birthday.name} avatarUrl={birthday.avatarUrl} size={48} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{birthday.name}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-medium text-foreground">{formatFullDate(birthday)}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-brand">
          {birthday.daysUntil <= 1 && <Cake className="animate-bounce-slow h-3 w-3" />}
          {daysUntilLabel(birthday.daysUntil)}
        </span>
      </div>
    </motion.li>
  );
}
