import { motion } from 'framer-motion'
import { ArrowRight, Database, GitMerge, BarChart3, Sparkles, Shield, CheckCircle2 } from 'lucide-react'
import type { DataIntegrity } from '../../types'

interface EngineeringInsightPanelProps {
  dataIntegrity?: DataIntegrity
}

const pipelineSteps = [
  {
    icon: Database,
    label: 'Raw Data',
    sublabel: 'CSV Import',
    color: '#71717a',
    description: 'Activity logs ingested from raw CSV files',
  },
  {
    icon: Shield,
    label: 'Normalize',
    sublabel: 'Deduplicate',
    color: '#f59e0b',
    description: 'Employee IDs standardized, duplicates removed',
  },
  {
    icon: GitMerge,
    label: 'Join',
    sublabel: 'Merge Strategy',
    color: '#38bdf8',
    description: 'Activities matched to employee master records',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    sublabel: 'Aggregation',
    color: '#22c55e',
    description: 'KPIs computed from validated, joined data',
  },
  {
    icon: Sparkles,
    label: 'AI Grounding',
    sublabel: 'Contextualize',
    color: '#a855f7',
    description: 'LLM grounded on verified analytics',
  },
  {
    icon: BarChart3,
    label: 'Dashboard',
    sublabel: 'Visualize',
    color: '#6366f1',
    description: 'Auditable, defensible executive metrics',
  },
]

export function EngineeringInsightPanel({ dataIntegrity }: EngineeringInsightPanelProps) {
  return (
    <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-[#1c1c1f]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
          <span className="text-[10px] font-mono text-[#6366f1] uppercase tracking-widest">Engineering Insight</span>
        </div>
        <h3 className="text-sm font-semibold text-[#fafafa]">Data Pipeline Transparency</h3>
        <p className="text-xs text-[#52525b] mt-0.5">
          Analytics are generated from normalized, joined data — never raw CSV
        </p>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {pipelineSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1 shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="group relative flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-opacity-60 transition-all cursor-default"
                style={{ '--step-color': step.color } as React.CSSProperties}
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}30` }}
                >
                  <step.icon size={13} style={{ color: step.color }} />
                </div>
                <div className="text-center">
                  <div className="text-[11px] font-semibold text-[#e4e4e7] leading-none">{step.label}</div>
                  <div className="text-[9px] font-mono text-[#52525b] mt-0.5 uppercase tracking-wider">{step.sublabel}</div>
                </div>

                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#27272a] border border-[#3f3f46] rounded-md px-2.5 py-1.5 text-[10px] text-[#e4e4e7] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {step.description}
                </div>
              </motion.div>

              {i < pipelineSteps.length - 1 && (
                <ArrowRight size={12} className="text-[#3f3f46] shrink-0" />
              )}
            </div>
          ))}
        </div>

        {dataIntegrity && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Raw Activities', value: dataIntegrity.totalRawActivities.toLocaleString(), color: '#71717a' },
              { label: 'After Normalization', value: dataIntegrity.normalizedActivities.toLocaleString(), color: '#f59e0b' },
              { label: 'Joined Records', value: dataIntegrity.joinedRecords.toLocaleString(), color: '#38bdf8' },
              { label: 'Quality Score', value: `${dataIntegrity.dataQualityScore}%`, color: '#22c55e' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-[#18181b] border border-[#27272a] px-3 py-2.5"
              >
                <div className="text-[10px] text-[#52525b] uppercase font-mono tracking-wider mb-1">{stat.label}</div>
                <div className="text-lg font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Duplicates Removed', value: dataIntegrity?.duplicatesRemoved ?? '—' },
            { label: 'Missing Employees', value: dataIntegrity?.missingEmployeeCount ?? '—' },
            { label: 'Extra Employees', value: dataIntegrity?.extraEmployeeCount ?? '—' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 rounded-full bg-[#18181b] border border-[#27272a] px-3 py-1">
              <CheckCircle2 size={11} className="text-[#22c55e]" />
              <span className="text-[11px] text-[#a1a1aa]">{item.label}:</span>
              <span className="text-[11px] font-mono text-[#fafafa] font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
