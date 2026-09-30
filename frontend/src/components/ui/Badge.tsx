import type { ReactNode } from "react";

type Tone = "green" | "amber" | "red" | "blue" | "gray";

const toneClasses: Record<Tone, string> = {
  green: "bg-brand-50 text-brand-700",
  amber: "bg-saffron-100 text-saffron-700",
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
  gray: "bg-ink-100 text-ink-600",
};

const Badge = ({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>
    {children}
  </span>
);

export default Badge;
