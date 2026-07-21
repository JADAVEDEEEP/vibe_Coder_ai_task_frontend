import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { Department } from '../../types'

interface DepartmentChartProps {
  data: Department[]
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#4f46e5', '#38bdf8', '#22c55e', '#f59e0b', '#a855f7']

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number; name: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="font-semibold text-[#fafafa] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4 text-[#a1a1aa]">
          <span>{p.name}</span>
          <span className="font-mono text-[#fafafa]">
            {p.name === 'recoverableHours' ? `${p.value?.toFixed(1)}h` : `$${p.value?.toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          interval={0}
          tickFormatter={(v: string) => v.length > 8 ? v.slice(0, 8) + '…' : v}
        />
        <YAxis
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#18181b' }} />
        <Bar dataKey="recoverableHours" name="recoverableHours" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.9} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
