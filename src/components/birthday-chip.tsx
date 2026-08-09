"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/avatar";
import { formatShortDate } from "@/features/birthdays/utils";
import type { Birthday } from "@/types/birthday";

type BirthdayChipProps = {
  birthday: Birthday;
  index: number;
};

export function BirthdayChip({ birthday, index }: BirthdayChipProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: "easeOut" }}
      whileHover={{ scale: 1.06, y: -1 }}
      className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pr-3 pl-1.5 text-xs transition-colors hover:border-brand/30 hover:bg-surface-hover"
    >
      <Avatar name={birthday.name} avatarUrl={birthday.avatarUrl} size={22} />
      <span className="max-w-36 truncate font-medium text-foreground/90">{birthday.name}</span>
      <span className="text-muted-foreground">{formatShortDate(birthday)}</span>
    </motion.li>
  );
}
