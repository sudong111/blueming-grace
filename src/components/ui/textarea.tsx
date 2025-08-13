import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm\n" +
          "  placeholder:text-muted-foreground\n" +
          "  transition-colors duration-300\n" +
          "  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400\n" +
          "  focus-visible:border-blue-400 focus-visible:shadow-md\n" +
          "  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
