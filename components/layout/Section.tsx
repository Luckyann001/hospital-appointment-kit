import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
};

export default function Section({ children, className, id, dark }: Props) {
  return (
    <section id={id} className={cn("py-24", dark && "bg-primary text-white", className)}>
      {children}
    </section>
  );
}
