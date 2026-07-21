import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { TaskBreakdown } from '../../types'

interface TaskBreakdownChartProps {
  data: TaskBreakdown[]
}

const COLORS = ['#6366f1', '#818cf8', '#38bdf8', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4']

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: TaskBreakdown }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2.5 text-xs shadow-xl max-w-[180px]">
      <p className="font-semibold text-[#fafafa] mb-1 leading-snug">{d.name}</p>
      <p className="text-[#a1a1aa]">Count: <span className="font-mono text-[#fafafa]">{d.value}</span></p>
      <p className="text-[#a1a1aa]">Share: <span className="font-mono text-[#fafafa]">{d.payload.percentage?.toFixed(1)}%</span></p>
      {d.payload.isRepetitive && (
        <span className="inline-block mt-1 text-[9px] font-mono bg-[#1e1b4b] text-[#818cf8] border border-[#312e81] px-1.5 py-0.5 rounded uppercase tracking-wider">Repetitive</span>
      )}
    </div>
  )
}

export function TaskBreakdownChart({ data }: TaskBreakdownChartProps) {
  const top = data.slice(0, 8)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={top}
          dataKey="count"
          nameKey="task"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          stroke="none"
        >
          {top.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.9} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={6}
          formatter={(v: string) => (
            <span style={{ fontSize: 10, color: '#71717a', fontFamily: 'JetBrains Mono' }}>
              {v.length > 16 ? v.slice(0, 16) + '…' : v}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
