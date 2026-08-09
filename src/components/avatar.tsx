import Image from "next/image";
import { initials } from "@/features/birthdays/utils";
import { cn } from "@/lib/cn";

type AvatarProps = {
  name: string;
  avatarUrl?: string;
  size: number;
  className?: string;
};

export function Avatar({ name, avatarUrl, size, className }: AvatarProps) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand/15 font-semibold text-brand",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  );
}
