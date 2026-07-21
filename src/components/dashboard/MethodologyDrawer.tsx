import { Drawer } from '../ui/Drawer'
import { CheckCircle, BookOpen, TrendingUp } from 'lucide-react'

interface MethodologySection {
  label: string
  content: string
}

interface MethodologyDrawerProps {
  open: boolean
  onClose: () => void
  kpiName: string
  formula: string
  businessReasoning: string
  trustStatement: string
  steps?: MethodologySection[]
}

export function MethodologyDrawer({
  open,
  onClose,
  kpiName,
  formula,
  businessReasoning,
  trustStatement,
  steps = [],
}: MethodologyDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} title={`Methodology — ${kpiName}`}>
      <div className="space-y-6">
        <div className="rounded-lg bg-[#1e1b4b] border border-[#312e81] p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={13} className="text-[#818cf8]" />
            <span className="text-xs font-semibold text-[#818cf8] uppercase tracking-wider">Formula</span>
          </div>
          <code className="text-sm font-mono text-[#c7d2fe] leading-relaxed block">{formula}</code>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-[#22c55e]" />
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Business Reasoning</span>
          </div>
          <p className="text-sm text-[#e4e4e7] leading-relaxed">{businessReasoning}</p>
        </div>

        {steps.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Calculation Steps</p>
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[10px] font-mono text-[#6366f1] shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#e4e4e7] mb-0.5">{step.label}</p>
                  <p className="text-xs text-[#71717a] leading-relaxed">{step.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg bg-[#052e16] border border-[#14532d] p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={13} className="text-[#22c55e]" />
            <span className="text-xs font-semibold text-[#22c55e] uppercase tracking-wider">Why Leadership Can Trust This</span>
          </div>
          <p className="text-sm text-[#86efac] leading-relaxed">{trustStatement}</p>
        </div>

        <div className="rounded-lg bg-[#18181b] border border-[#27272a] p-4">
          <p className="text-[10px] font-mono text-[#52525b] uppercase tracking-wider mb-1">Data Source</p>
          <p className="text-xs text-[#71717a]">
            This metric is derived from normalized activity logs joined with the employee master record using a deterministic
            merge strategy. Raw CSV is never piped directly — all calculations run on validated, deduplicated data.
          </p>
        </div>
      </div>
    </Drawer>
  )
}
