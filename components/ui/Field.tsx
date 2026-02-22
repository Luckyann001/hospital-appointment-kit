import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export default function Field({ label, children }: Props) {
  return (
    <label className="block">
      <span className="label-base">{label}</span>
      {children}
    </label>
  );
}
