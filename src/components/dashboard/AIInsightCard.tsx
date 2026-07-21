import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface AIInsightCardProps {
  insight: string
  source?: string
}

export function AIInsightCard({ insight, source }: AIInsightCardProps) {
  if (!insight) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-lg border border-[#312e81] bg-gradient-to-r from-[#1e1b4b] to-[#18181b] px-4 py-3 flex gap-3"
    >
      <div className="w-6 h-6 rounded-md bg-[#312e81] flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={12} className="text-[#a5b4fc]" />
      </div>
      <div>
        <p className="text-[11px] font-mono text-[#6366f1] uppercase tracking-widest mb-1">AI Insight</p>
        <p className="text-sm text-[#c7d2fe] leading-relaxed">{insight}</p>
        {source && (
          <p className="text-[10px] text-[#4338ca] mt-1 font-mono">Based on: {source}</p>
        )}
      </div>
    </motion.div>
  )
}
