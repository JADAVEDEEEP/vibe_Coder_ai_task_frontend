import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Briefcase, Mail, Calendar, TrendingUp, Clock, DollarSign, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart,
  PolarGrid, PolarAngleAxis, Radar, Cell,
} from 'recharts'
import { Badge } from '../ui/Badge'
import type { EmployeeDetail } from '../../types'

interface EmployeeProfileProps {
  employee: EmployeeDetail
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}1a` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className="text-[11px] text-[#52525b] font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold font-mono text-[#fafafa]">{value}</div>
    </div>
  )
}

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  const navigate = useNavigate()

  const initials = employee.name
    ? employee.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : employee.employeeId.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-[#52525b] hover:text-[#a1a1aa] transition-colors"
      >
        <ArrowLeft size={13} />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#1c1c1f] bg-[#111113] p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-indigo-900/30 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start flex-wrap gap-2">
              <h2 className="text-xl font-bold text-[#fafafa] leading-tight">{employee.name || employee.employeeId}</h2>
              <Badge variant={employee.status === 'active' ? 'success' : 'default'}>{employee.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {employee.role && (
                <span className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <Briefcase size={11} /> {employee.role}
                </span>
              )}
              {employee.department && (
                <span className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <Building2 size={11} /> {employee.department}
                </span>
              )}
              {employee.email && (
                <span className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <Mail size={11} /> {employee.email}
                </span>
              )}
              {employee.joinDate && (
                <span className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <Calendar size={11} /> Joined {employee.joinDate}
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-[#3f3f46] mt-2">ID: {employee.employeeId}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Activities"
          value={(employee.summary?.totalActivities ?? 0).toLocaleString()}
          icon={<Zap size={14} />}
          color="#6366f1"
        />
        <StatCard
          label="Recoverable Hours"
          value={`${(employee.summary?.recoverableHours ?? 0).toFixed(1)}h`}
          icon={<Clock size={14} />}
          color="#38bdf8"
        />
        <StatCard
          label="Recoverable $"
          value={`$${Math.round(employee.summary?.recoverableMoney ?? 0).toLocaleString()}`}
          icon={<DollarSign size={14} />}
          color="#22c55e"
        />
        <StatCard
          label="Automation Score"
          value={`${employee.summary?.automationScore ?? 0}`}
          icon={<TrendingUp size={14} />}
          color="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {employee.topTasks?.length > 0 && (
          <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] p-5">
            <h3 className="text-sm font-semibold text-[#fafafa] mb-4">Top Tasks</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={employee.topTasks.slice(0, 6)} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="task" tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={80} tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#fafafa' }}
                  itemStyle={{ color: '#a1a1aa' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {employee.topTasks.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={['#6366f1', '#818cf8', '#38bdf8', '#22c55e', '#f59e0b', '#a855f7'][i % 6]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {employee.peerComparison && (
          <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] p-5">
            <h3 className="text-sm font-semibold text-[#fafafa] mb-1">Peer Comparison</h3>
            <p className="text-[11px] text-[#52525b] mb-4">{employee.department} department benchmark</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart
                data={[
                  {
                    metric: 'Rec. Hours',
                    employee: employee.summary?.recoverableHours ?? 0,
                    avg: employee.peerComparison.departmentAvgRecoverableHours,
                  },
                  {
                    metric: 'Auto Score',
                    employee: employee.summary?.automationScore ?? 0,
                    avg: employee.peerComparison.departmentAvgAutomationScore,
                  },
                  {
                    metric: 'Percentile',
                    employee: employee.peerComparison.percentileRank,
                    avg: 50,
                  },
                ]}
              >
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Radar name="Employee" dataKey="employee" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                <Radar name="Dept Avg" dataKey="avg" stroke="#27272a" fill="#27272a" fillOpacity={0.1} strokeDasharray="4 4" />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#fafafa' }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#71717a]">
                <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
                This employee
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#71717a]">
                <div className="w-2 h-2 rounded-full bg-[#3f3f46]" />
                Dept average
              </div>
              <div className="ml-auto">
                <Badge variant="brand">{employee.peerComparison.benchmark}</Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      {employee.topRepetitiveTasks?.length > 0 && (
        <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1c1c1f]">
            <h3 className="text-sm font-semibold text-[#fafafa]">Top Repetitive Tasks</h3>
            <p className="text-[11px] text-[#52525b] mt-0.5">Highest automation potential</p>
          </div>
          <div className="divide-y divide-[#18181b]">
            {employee.topRepetitiveTasks.map((task, i) => (
              <div key={i} className="px-5 py-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-[#e4e4e7] font-medium">{task.task}</span>
                    <Badge
                      variant={
                        task.automationPotential === 'high' ? 'danger' :
                        task.automationPotential === 'medium' ? 'warning' : 'default'
                      }
                    >
                      {task.automationPotential}
                    </Badge>
                  </div>
                  {task.suggestion && (
                    <p className="text-[11px] text-[#52525b] mt-0.5">{task.suggestion}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-[#38bdf8]">{task.recoverableHours?.toFixed(1)}h</div>
                  <div className="text-[10px] text-[#52525b]">{task.count}x</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
