import { useState } from 'react'
import { Search, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '../ui/Badge'
import type { AutomationRanking } from '../../types'

interface AutomationTableProps {
  data: AutomationRanking[]
}

type SortKey = keyof AutomationRanking
type SortDir = 'asc' | 'desc'

const priorityOrder = { high: 0, medium: 1, low: 2 }

export function AutomationTable({ data }: AutomationTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('recoverableMoney')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = data
    .filter(
      (r) =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.department?.toLowerCase().includes(search.toLowerCase()) ||
        r.role?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (sortKey === 'priority') {
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority]
        return sortDir === 'asc' ? diff : -diff
      }
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown size={11} className="text-[#3f3f46]" />
    return sortDir === 'desc' ? (
      <ChevronDown size={11} className="text-[#6366f1]" />
    ) : (
      <ChevronUp size={11} className="text-[#6366f1]" />
    )
  }

  const cols: { key: SortKey; label: string; align?: 'right' }[] = [
    { key: 'name', label: 'Task Category' },
    { key: 'department', label: 'Scope' },
    { key: 'priority', label: 'Priority' },
    { key: 'recoverableMoney', label: 'Recoverable $', align: 'right' },
    { key: 'recoverableHours', label: 'Hours', align: 'right' },
    { key: 'automationScore', label: 'Score', align: 'right' },
  ]

  return (
    <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1c1c1f] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-[#fafafa]">Automation Ranking</h3>
          <p className="text-[11px] text-[#52525b] mt-0.5">{filtered.length} of {data.length} employees</p>
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#52525b]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter employees..."
            className="h-8 w-44 rounded-lg bg-[#18181b] border border-[#27272a] pl-7 pr-3 text-xs text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1c1c1f]">
              {cols.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-[#52525b] cursor-pointer hover:text-[#a1a1aa] transition-colors whitespace-nowrap select-none ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label} <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
                </tr>
          </thead>
          <tbody className="divide-y divide-[#18181b]">
            {filtered.map((row, i) => (
              <motion.tr
                key={row.employeeId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025 }}
                className="hover:bg-[#18181b] transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-[#fafafa]">{row.name}</div>
                  <div className="text-[10px] font-mono text-[#52525b]">{row.topRepetitiveTask}</div>
                </td>
                <td className="px-4 py-3 text-[#71717a] text-xs font-mono">Cross-Dept</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      row.priority === 'high'
                        ? 'danger'
                        : row.priority === 'medium'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {row.priority}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[#22c55e] font-semibold">
                  ${row.recoverableMoney != null ? Math.round(row.recoverableMoney).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[#38bdf8]">
                  {row.recoverableHours?.toFixed(1) ?? '—'}h
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-16 h-1.5 rounded-full bg-[#27272a] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
                        style={{ width: `${Math.min(100, row.automationScore ?? 0)}%` }}
                      />
                    </div>
                    <span className="font-mono text-[#a1a1aa] text-[11px]">{row.automationScore ?? '—'}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[#52525b] text-sm">No results for &ldquo;{search}&rdquo;</div>
        )}
      </div>
    </div>
  )
}
