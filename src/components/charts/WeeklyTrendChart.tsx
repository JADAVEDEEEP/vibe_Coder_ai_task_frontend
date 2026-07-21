import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { WeeklyTrend } from '../../types'

interface WeeklyTrendChartProps {
  data: WeeklyTrend[]
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="font-mono text-[#71717a] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-6">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono text-[#fafafa]">
            {p.name === 'recoverableHours' ? `${p.value?.toFixed(1)}h` : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" />
        <XAxis
          dataKey="week"
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={6}
          formatter={(v: string) => (
            <span style={{ fontSize: 10, color: '#71717a', fontFamily: 'JetBrains Mono' }}>{v}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="recoverableHours"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 3, fill: '#6366f1' }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="activeEmployees"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 3, fill: '#22c55e' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
