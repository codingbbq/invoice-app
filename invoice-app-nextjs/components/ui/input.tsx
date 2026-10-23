import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-[border-color,box-shadow,background-color] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-900 placeholder:text-slate-400 hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-4 focus-visible:ring-blue-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none aria-invalid:border-red-300 aria-invalid:ring-4 aria-invalid:ring-red-100",
        className
      )}
      {...props}
    />
  )
}

export { Input }
