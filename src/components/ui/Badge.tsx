import { type ReactNode } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand'

interface BadgeProps {
  children: ReactNode
  variant?: Variant
  size?: 'sm' | 'md'
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-[#27272a] text-[#a1a1aa] border-[#3f3f46]',
  success: 'bg-[#052e16] text-[#22c55e] border-[#14532d]',
  warning: 'bg-[#431407] text-[#f59e0b] border-[#78350f]',
  danger: 'bg-[#450a0a] text-[#ef4444] border-[#7f1d1d]',
  info: 'bg-[#082f49] text-[#38bdf8] border-[#0c4a6e]',
  brand: 'bg-[#1e1b4b] text-[#818cf8] border-[#312e81]',
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-mono font-medium tracking-wide uppercase ${sizeClass} ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}
