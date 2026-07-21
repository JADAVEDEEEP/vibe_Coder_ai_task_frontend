import { useState } from 'react'
import { Search, ChevronRight, Building2, Briefcase, Clock, DollarSign, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Layout } from '../components/layout/Layout'
import { Badge } from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { fetchEmployee } from '../api/employee'
import { useDashboard } from '../hooks/useDashboard'

const KNOWN_IDS = [
  'E001','E002','E003','E004','E005','E006','E007','E008',
  'E009','E010','E011','E012','E099',
]

function useEmployeeList(ids: string[]) {
  return useQuery({
    queryKey: ['employeeList', ids],
    queryFn: async () => {
      const results = await Promise.allSettled(ids.map((id) => fetchEmployee(id)))
      return results
        .map((r, i) => (r.status === 'fulfilled' ? r.value : null))
        .filter(Boolean)
    },
    staleTime: 10 * 60 * 1000,
  })
}

export default function EmployeesPage() {
  const { data: dashboard } = useDashboard()
  const [search, setSearch] = useState('')
  const [lookupId, setLookupId] = useState('')
  const navigate = useNavigate()

  const extraIds = [
    ...(dashboard?.employeesWithoutActivity?.map((e) => e.employeeId) ?? []),
  ]
  const allIds = Array.from(new Set([...KNOWN_IDS, ...extraIds]))

  const { data: employees = [], isLoading } = useEmployeeList(allIds)

  const filtered = employees.filter(
    (e) =>
      !search ||
      e!.name?.toLowerCase().includes(search.toLowerCase()) ||
      e!.department?.toLowerCase().includes(search.toLowerCase()) ||
      e!.role?.toLowerCase().includes(search.toLowerCase()) ||
      e!.employeeId?.toLowerCase().includes(search.toLowerCase())
  )

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    const id = lookupId.trim().toUpperCase()
    if (id) navigate(`/employees/${id}`)
  }

  return (
    <Layout
      title="Employees"
      subtitle={`${filtered.length} employees · Click any card to drill down`}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="relative w-full">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, department, role..."
              className="w-full h-9 rounded-lg bg-[#18181b] border border-[#27272a] pl-8 pr-4 text-sm text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>

          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Lookup by ID (e.g. E005)"
              className="flex-1 h-9 rounded-lg bg-[#18181b] border border-[#27272a] px-3 text-sm text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] font-mono transition-colors sm:flex-none sm:w-44"
            />
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-[#6366f1] text-xs text-[#a1a1aa] hover:text-[#e4e4e7] transition-all shrink-0"
            >
              Go →
            </button>
          </form>
        </div>

        {dashboard?.missingEmployees && dashboard.missingEmployees.length > 0 && (
          <div className="rounded-lg border border-[#78350f] bg-[#431407]/30 px-3 sm:px-4 py-3 flex items-start gap-2">
            <AlertTriangle size={13} className="text-[#f59e0b] shrink-0 mt-0.5" />
            <span className="text-xs text-[#fbbf24] break-words">
              {dashboard.missingEmployees.length} employee{dashboard.missingEmployees.length > 1 ? 's' : ''} detected in activity logs but missing from master records:{' '}
              <span className="font-mono text-[10px] sm:text-xs">{dashboard.missingEmployees.map((m) => m.employeeId).join(', ')}</span>
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((emp, i) => {
              if (!emp) return null
              const initials = emp.name
                ? emp.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                : emp.employeeId.slice(0, 2).toUpperCase()

              const score = emp.summary?.automationScore ?? 0
              const scoreColor = score > 60 ? '#ef4444' : score > 35 ? '#f59e0b' : '#22c55e'

              return (
                <motion.div
                  key={emp.employeeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025 }}
                  onClick={() => navigate(`/employees/${emp.employeeId}`)}
                  className="group rounded-xl border border-[#1c1c1f] bg-[#111113] p-4 cursor-pointer hover:border-[#27272a] hover:bg-[#18181b] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#fafafa] truncate">{emp.name || emp.employeeId}</p>
                        <ChevronRight size={13} className="text-[#3f3f46] group-hover:text-[#71717a] transition-colors shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {emp.role && (
                          <span className="flex items-center gap-1 text-[10px] text-[#52525b]">
                            <Briefcase size={9} /> {emp.role}
                          </span>
                        )}
                        {emp.department && (
                          <span className="flex items-center gap-1 text-[10px] text-[#52525b]">
                            <Building2 size={9} /> {emp.department}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-[#3f3f46] mt-0.5">{emp.employeeId}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-[#18181b] border border-[#1c1c1f] p-2 text-center group-hover:border-[#27272a] transition-colors">
                      <div className="flex items-center justify-center gap-0.5 text-xs font-mono text-[#38bdf8] font-semibold">
                        <Clock size={9} /> {emp.summary?.recoverableHours?.toFixed(1)}h
                      </div>
                      <div className="text-[9px] text-[#52525b] mt-0.5">Recoverable</div>
                    </div>
                    <div className="rounded-lg bg-[#18181b] border border-[#1c1c1f] p-2 text-center group-hover:border-[#27272a] transition-colors">
                      <div className="flex items-center justify-center gap-0.5 text-xs font-mono text-[#22c55e] font-semibold">
                        <DollarSign size={9} />
                        {emp.summary?.recoverableMoney
                          ? emp.summary.recoverableMoney >= 1000
                            ? `${(emp.summary.recoverableMoney / 1000).toFixed(1)}k`
                            : Math.round(emp.summary.recoverableMoney)
                          : '0'}
                      </div>
                      <div className="text-[9px] text-[#52525b] mt-0.5">Savings</div>
                    </div>
                    <div className="rounded-lg bg-[#18181b] border border-[#1c1c1f] p-2 text-center group-hover:border-[#27272a] transition-colors">
                      <div className="text-xs font-mono font-semibold" style={{ color: scoreColor }}>
                        {score}
                      </div>
                      <div className="text-[9px] text-[#52525b] mt-0.5">Score</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant={score > 60 ? 'danger' : score > 35 ? 'warning' : 'default'}>
                      {score > 60 ? 'high' : score > 35 ? 'medium' : 'low'} priority
                    </Badge>
                    {emp.topRepetitiveTasks?.[0] && (
                      <span className="text-[10px] text-[#52525b] truncate max-w-[120px]">
                        {emp.topRepetitiveTasks[0].task}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && !search && (
          <div className="py-16 text-center">
            <p className="text-[#52525b] text-sm">Loading employee profiles…</p>
          </div>
        )}
        {!isLoading && filtered.length === 0 && search && (
          <div className="py-16 text-center">
            <p className="text-[#52525b] text-sm">No employees found for &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
