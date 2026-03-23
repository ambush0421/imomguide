import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

import { createFieldStyle, fieldControlClassName } from '@/components/ui/field-control'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, style, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      fieldControlClassName,
      'group flex h-[var(--field-height)] min-h-[var(--field-height)] items-center justify-between gap-3 px-4 py-3 text-left',
      'data-[placeholder]:text-[var(--foreground-subtle)] data-[state=open]:border-[var(--border-accent-strong)]',
      'data-[state=open]:bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-elevated))]',
      'data-[state=open]:shadow-[var(--shadow-field-focus)] [&>span]:line-clamp-1',
      'data-[state=open]:[&_svg]:rotate-180',
      className,
    )}
    style={createFieldStyle(style)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 shrink-0 text-[var(--foreground-subtle)] transition-transform duration-300 ease-[var(--motion-snappy)]" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', sideOffset = 12, style, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-[var(--select-content-radius)]',
        'border border-[var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-popover))]',
        'text-[var(--foreground)] shadow-[var(--shadow-floating-strong)] backdrop-blur-2xl',
        'before:pointer-events-none before:absolute before:inset-px before:rounded-[calc(var(--select-content-radius)-1px)]',
        'before:border before:border-[var(--border-highlight)] before:content-[""]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-10 after:bg-gradient-to-b',
        'after:from-[var(--highlight-soft)] after:via-[var(--highlight-accent)] after:to-transparent after:content-[""]',
        'data-[state=open]:animate-[fade-in_180ms_cubic-bezier(0.22,1,0.36,1)]',
        position === 'popper' &&
          'origin-[var(--radix-select-content-transform-origin)]',
        className,
      )}
      position={position}
      sideOffset={sideOffset}
      style={
        {
          '--select-content-radius': '22px',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'relative z-10 p-2',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))

SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-[calc(var(--select-content-radius)-10px)] py-3 pl-10 pr-4 text-sm outline-none',
      'transition-[background-color,color,transform] duration-300 ease-[var(--motion-snappy)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'data-[highlighted]:bg-[var(--surface-tint)] data-[highlighted]:text-[var(--foreground)]',
      'data-[state=checked]:bg-[var(--surface-tint)]',
      className,
    )}
    {...props}
  >
    <span className="absolute left-3 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-[var(--accent-strong)]" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))

SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
