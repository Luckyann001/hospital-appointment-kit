import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, ...props }: Props) {
  return <select className={cn("input-base", className)} {...props} />;
}
