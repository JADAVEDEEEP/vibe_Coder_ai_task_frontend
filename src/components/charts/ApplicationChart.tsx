import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { ApplicationBreakdown } from '../../types'

interface ApplicationChartProps {
  data: ApplicationBreakdown[]
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number; payload: ApplicationBreakdown }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="font-semibold text-[#fafafa] mb-1">{label}</p>
      <p className="text-[#a1a1aa]">Usage: <span className="font-mono text-[#fafafa]">{d.value}</span></p>
      <p className="text-[#a1a1aa]">Share: <span className="font-mono text-[#fafafa]">{d.payload.percentage?.toFixed(1)}%</span></p>
      {d.payload.automationPotential && (
        <p className="text-[#a1a1aa] mt-1">
          Automation: <span className="font-mono text-[#22c55e]">{d.payload.automationPotential}</span>
        </p>
      )}
    </div>
  )
}

export function ApplicationChart({ data }: ApplicationChartProps) {
  const top = data.slice(0, 10)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={top} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="application"
          tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={90}
          tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#18181b' }} />
        <Bar dataKey="usageCount" fill="#38bdf8" fillOpacity={0.85} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
