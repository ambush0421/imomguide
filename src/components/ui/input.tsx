import * as React from 'react'

import { createFieldStyle, fieldControlClassName } from '@/components/ui/field-control'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, style, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          fieldControlClassName,
          'flex h-[var(--field-height)] min-h-[var(--field-height)] items-center px-4 py-3',
          'placeholder:text-[var(--foreground-subtle)] selection:bg-[var(--accent-soft)]',
          className,
        )}
        style={createFieldStyle(style)}
        ref={ref}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export { Input }
