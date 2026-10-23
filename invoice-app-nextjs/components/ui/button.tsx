import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl border bg-clip-padding font-medium shadow-sm transition-[color,background-color,border-color,box-shadow,transform] outline-none select-none focus-visible:ring-4 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-300 aria-invalid:ring-red-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-slate-900 bg-slate-900 text-white hover:border-slate-800 hover:bg-slate-800 focus-visible:ring-slate-200",
        primary:
          "border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700 focus-visible:ring-blue-100",
        outline:
          "border-gray-200 bg-white text-slate-700 hover:border-gray-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-100 aria-expanded:bg-slate-50 aria-expanded:text-slate-900",
        secondary:
          "border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-100 aria-expanded:bg-slate-100 aria-expanded:text-slate-900",
        ghost:
          "border-transparent bg-transparent text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-100 aria-expanded:bg-slate-50 aria-expanded:text-slate-900",
        destructive:
          "border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 focus-visible:ring-red-100",
        link: "border-transparent bg-transparent p-0 text-slate-900 underline-offset-4 shadow-none hover:underline focus-visible:ring-0",
      },
      size: {
        default:
          "h-10 gap-2 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-3 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10",
        "icon-xs":
          "size-7 rounded-lg in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-lg in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
