import { type ReactNode, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-[#6366f1] hover:bg-[#4f46e5] text-white border-transparent shadow-lg shadow-indigo-900/20',
  secondary: 'bg-[#18181b] hover:bg-[#27272a] text-[#e4e4e7] border-[#3f3f46]',
  ghost: 'bg-transparent hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] border-transparent',
  danger: 'bg-[#450a0a] hover:bg-[#7f1d1d] text-[#ef4444] border-[#7f1d1d]',
}

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  )
}
