import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { AutomationRanking } from '../../types'

interface AutomationRankingChartProps {
  data: AutomationRanking[]
}

const priorityColor: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number; payload: AutomationRanking }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2.5 text-xs shadow-xl max-w-[200px]">
      <p className="font-semibold text-[#fafafa] mb-1">{label}</p>
      <p className="text-[#a1a1aa]">{d.department}</p>
      <p className="text-[#a1a1aa] mt-1">Money: <span className="font-mono text-[#22c55e]">${d.recoverableMoney?.toLocaleString()}</span></p>
      <p className="text-[#a1a1aa]">Hours: <span className="font-mono text-[#38bdf8]">{d.recoverableHours?.toFixed(1)}h</span></p>
    </div>
  )
}

export function AutomationRankingChart({ data }: AutomationRankingChartProps) {
  const top = data.slice(0, 10)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={top} margin={{ top: 4, right: 12, left: 0, bottom: 0 }} barSize={18}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#52525b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) => {
            const parts = String(v || '').split(' ')
            return parts[0]?.slice(0, 8) ?? ''
          }}
        />
        <YAxis
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#18181b' }} />
        <Bar dataKey="recoverableMoney" radius={[4, 4, 0, 0]}>
          {top.map((entry, i) => (
            <Cell key={i} fill={priorityColor[entry.priority] ?? '#6366f1'} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
