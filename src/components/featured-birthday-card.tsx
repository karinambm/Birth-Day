"use client";

import { motion } from "framer-motion";
import { Cake, PartyPopper, Sparkles } from "lucide-react";
import type { Birthday } from "@/types/birthday";
import { Avatar } from "@/components/avatar";

type FeaturedBirthdayCardProps = {
  birthday: Birthday;
  index: number;
};

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  duration: 3 + (i % 4),
  delay: i * 0.25,
}));

export function FeaturedBirthdayCard({ birthday, index }: FeaturedBirthdayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-brand/40 bg-linear-to-br from-surface via-surface to-brand/10 p-8 shadow-glow transition-shadow hover:shadow-[0_0_0_1px_rgba(244,178,71,0.3),0_12px_40px_-8px_rgba(244,178,71,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((particle, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-brand/60"
            style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <Sparkles
        className="animate-bounce-slow absolute top-6 left-6 h-4 w-4 text-brand/70"
        style={{ animationDelay: "0.3s" }}
      />
      <Cake
        className="animate-bounce-slow absolute right-8 bottom-8 h-5 w-5 text-brand/70"
        style={{ animationDelay: "0.8s" }}
      />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
        >
          <PartyPopper className="h-8 w-8 text-brand" />
        </motion.div>

        <Avatar
          name={birthday.name}
          avatarUrl={birthday.avatarUrl}
          size={160}
          className="animate-pulse-glow border-4 border-brand"
        />

        <div>
          <p className="text-sm font-medium tracking-wide text-brand uppercase">Hoje</p>
          <h2 className="text-shimmer mt-1 text-2xl font-bold">
            Feliz aniversário, {birthday.name.split(" ")[0]}! 🎉
          </h2>
        </div>
      </div>
    </motion.div>
  );
}
