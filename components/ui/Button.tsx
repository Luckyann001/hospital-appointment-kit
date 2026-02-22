import Link from "next/link";
import type { Route } from "next";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline";

type LinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonProps = {
  href?: never;
  asChild?: boolean;
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type Props = LinkProps | ButtonProps;

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white border border-accent hover:bg-primary",
  secondary: "bg-white text-primary border border-primary hover:bg-slate-100",
  outline: "bg-transparent text-primary border border-slate-300 hover:bg-slate-100"
};

const shared =
  "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20";

export default function Button({ children, variant = "primary", className, ...props }: Props) {
  const style = cn(shared, variants[variant], className);
  const asChild = "asChild" in props ? props.asChild : false;

  if ("href" in props && typeof props.href === "string") {
    return (
      <Link href={props.href as Route} className={style}>
        {children}
      </Link>
    );
  }

  if (asChild) {
    const { asChild: _asChild, ...slotProps } = props as ButtonProps;
    return (
      <Slot className={style} {...slotProps}>
        {children}
      </Slot>
    );
  }

  const { asChild: _asChild, ...buttonProps } = props as ButtonProps;
  return (
    <button className={style} {...buttonProps}>
      {children}
    </button>
  );
}
