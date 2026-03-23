import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import type { CSSVariableStyle } from '@/components/ui/field-control'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, style, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'relative isolate grid w-full grid-cols-1 gap-[var(--tabs-padding)] rounded-[var(--tabs-radius)] border border-[var(--border-subtle)] p-[var(--tabs-padding)] text-[var(--foreground-muted)]',
      'bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-overlay))] shadow-[var(--shadow-embedded)] backdrop-blur-xl',
      'before:pointer-events-none before:absolute before:inset-px before:rounded-[calc(var(--tabs-radius)-1px)] before:border before:border-[var(--border-highlight)] before:content-[""]',
      'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-12 after:bg-gradient-to-b after:from-[var(--highlight-soft)] after:via-[var(--highlight-accent)] after:to-transparent after:content-[""]',
      'sm:inline-flex sm:w-auto sm:grid-cols-none',
      className,
    )}
    style={
      {
        '--tabs-radius': '24px',
        '--tabs-padding': '6px',
        '--tabs-trigger-radius':
          'max(calc(var(--tabs-radius) - var(--tabs-padding)), var(--radius-field))',
        ...style,
      } as CSSVariableStyle
    }
    {...props}
  />
))

TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative z-10 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--tabs-trigger-radius)] border border-transparent px-4 py-2.5 text-sm font-medium',
      'text-[var(--foreground-muted)] transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-[var(--motion-snappy)]',
      'hover:text-[var(--foreground)] hover:bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-elevated))]',
      'focus-visible:outline-none focus-visible:border-[var(--border-accent-strong)] focus-visible:shadow-[var(--shadow-field-focus)]',
      'disabled:pointer-events-none disabled:opacity-50 data-[state=active]:-translate-y-px',
      'data-[state=active]:border-[var(--border-highlight)]',
      'data-[state=active]:bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-elevated))]',
      'data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-[var(--shadow-pill)]',
      'sm:w-auto',
      className,
    )}
    {...props}
  />
))

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-6 focus-visible:outline-none', className)}
    {...props}
  />
))

TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
