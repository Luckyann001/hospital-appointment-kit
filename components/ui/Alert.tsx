import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  tone?: "info" | "error";
};

export default function Alert({ children, tone = "info" }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        tone === "info"
          ? "border-accent/40 bg-accent/10 text-primary"
          : "border-red-300 bg-red-50 text-red-700"
      )}
    >
      {children}
    </div>
  );
}
