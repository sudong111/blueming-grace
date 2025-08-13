import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm\n" +
            "  transition-colors duration-300\n" +
            "  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground\n" +
            "  placeholder:text-muted-foreground\n" +
            "  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400\n" +
            "  focus-visible:border-blue-400 focus-visible:shadow-md\n" +
            "  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
