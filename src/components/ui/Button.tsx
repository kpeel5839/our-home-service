import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-white active:opacity-80",
  secondary: "bg-primary-light text-primary active:opacity-80",
  ghost: "bg-transparent text-text-muted hover:bg-gray-100 active:bg-gray-100",
  danger: "bg-danger text-white active:opacity-80",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-5 py-3 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium min-h-[44px] min-w-[44px] transition-opacity flex items-center justify-center gap-2",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
