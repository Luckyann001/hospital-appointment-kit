import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Badge({ children }: Props) {
  return (
    <span className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
      {children}
    </span>
  );
}
