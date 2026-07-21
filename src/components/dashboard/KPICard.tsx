import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Tooltip } from '../ui/Tooltip'
import { MethodologyDrawer } from './MethodologyDrawer'

interface KPICardProps {
  label: string
  value: string
  subtext?: string
  tooltip: string
  trend?: number
  icon: ReactNode
  accentColor?: string
  formula: string
  businessReasoning: string
  trustStatement: string
  steps?: { label: string; content: string }[]
}

export function KPICard({
  label,
  value,
  subtext,
  tooltip,
  trend,
  icon,
  accentColor = '#6366f1',
  formula,
  businessReasoning,
  trustStatement,
  steps,
}: KPICardProps) {
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  const trendIcon =
    trend === undefined ? null : trend > 0 ? (
      <TrendingUp size={12} className="text-[#22c55e]" />
    ) : trend < 0 ? (
      <TrendingDown size={12} className="text-[#ef4444]" />
    ) : (
      <Minus size={12} className="text-[#71717a]" />
    )

  const trendLabel =
    trend === undefined
      ? null
      : trend > 0
        ? `+${trend}% vs avg`
        : trend < 0
          ? `${trend}% vs avg`
          : 'On par with avg'

  return (
    <>
      <motion.div
        whileHover={{ y: -2, boxShadow: `0 8px 32px ${accentColor}18` }}
        transition={{ duration: 0.2 }}
        className="group relative rounded-xl border border-[#1c1c1f] bg-[#111113] p-5 cursor-default overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accentColor}1a`, border: `1px solid ${accentColor}30` }}
            >
              <span style={{ color: accentColor }}>{icon}</span>
            </div>
            <span className="text-xs font-medium text-[#71717a] tracking-wide">{label}</span>
          </div>
          <Tooltip content={tooltip}>
            <HelpCircle size={13} className="text-[#3f3f46] hover:text-[#71717a] transition-colors mt-1" />
          </Tooltip>
        </div>

        <div className="mb-3">
          <div className="text-2xl font-bold text-[#fafafa] tracking-tight font-mono">{value}</div>
          {subtext && (
            <div className="text-[11px] text-[#52525b] mt-1">{subtext}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {trendIcon && (
            <div className="flex items-center gap-1">
              {trendIcon}
              <span className="text-[11px] text-[#71717a] font-mono">{trendLabel}</span>
            </div>
          )}
          <button
            onClick={() => setMethodologyOpen(true)}
            className="text-[10px] font-mono text-[#52525b] hover:text-[#6366f1] transition-colors uppercase tracking-wider ml-auto"
          >
            View Methodology →
          </button>
        </div>
      </motion.div>

      <MethodologyDrawer
        open={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
        kpiName={label}
        formula={formula}
        businessReasoning={businessReasoning}
        trustStatement={trustStatement}
        steps={steps}
      />
    </>
  )
}
