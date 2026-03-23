import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-[var(--border-subtle)]',
      'bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-overlay))] shadow-[var(--shadow-embedded)] backdrop-blur-xl',
      'after:pointer-events-none after:absolute after:inset-px after:rounded-full after:border after:border-[var(--border-highlight)] after:content-[""]',
      'transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[var(--motion-snappy)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
      'disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-[var(--border-accent-strong)]',
      'data-[state=checked]:bg-[linear-gradient(180deg,var(--surface-accent-glass),var(--surface-overlay))]',
      'data-[state=checked]:shadow-[var(--shadow-toggle-track)]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none relative block size-5 rounded-full border border-[var(--border-highlight)]',
        'bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-elevated))] shadow-[var(--shadow-toggle-thumb)] ring-0',
        'transition-[transform,box-shadow,background-color,scale] duration-300 ease-[var(--motion-snappy)]',
        'data-[state=checked]:translate-x-[22px] data-[state=checked]:scale-[1.03]',
        'data-[state=unchecked]:translate-x-[3px]',
      )}
    />
  </SwitchPrimitives.Root>
))

Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
