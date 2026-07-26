import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-busy:opacity-100",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        /** Home filter/sort toolbar — muted ink + soft hover */
        toolbar:
          "text-home-filter-ink hover:bg-black/5 dark:hover:bg-white/10",
        soft: "bg-transparent text-primary hover:bg-primary/5",
        link: "text-primary underline-offset-4 hover:underline",
        /** Full-width menu row (sort options) */
        menuitem:
          "h-12 w-full justify-start gap-3 rounded-none px-3 text-base font-normal leading-6 tracking-[0.0094em] text-home-filter-ink hover:bg-black/5 dark:hover:bg-white/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        /** Filter/sort toolbar controls — Figma h-56 pill */
        pill: "h-14 rounded-full px-4 text-base font-medium leading-6 tracking-[0.0094em]",
        /** Apply / clear actions */
        pillSm: "h-10 rounded-full px-6 text-sm font-medium leading-5 tracking-[0.0071em]",
        /** Stretch to container (accordion field headers) */
        field: "h-14 w-full rounded-none px-3 text-base font-medium",
        /** Size comes from the variant (e.g. menuitem) */
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Shows a shadcn Spinner and disables the button. */
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={asChild ? undefined : isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={asChild ? isDisabled : undefined}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className="size-5" />
            <span className="sr-only">{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
