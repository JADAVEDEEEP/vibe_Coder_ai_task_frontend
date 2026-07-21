interface SkeletonProps {
  className?: string
  rows?: number
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-md ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-2 w-40" />
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-4">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
