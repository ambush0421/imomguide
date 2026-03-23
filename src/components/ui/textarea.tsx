import * as React from 'react'

import { createFieldStyle, fieldControlClassName } from '@/components/ui/field-control'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, style, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        fieldControlClassName,
        'min-h-28 resize-y px-4 py-3 leading-7 placeholder:text-[var(--foreground-subtle)] selection:bg-[var(--accent-soft)]',
        className,
      )}
      style={createFieldStyle(style)}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

export { Textarea }
