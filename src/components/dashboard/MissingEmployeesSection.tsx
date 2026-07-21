import { AlertTriangle, UserX } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '../ui/Badge'
import type { MissingEmployee } from '../../types'

interface MissingEmployeesSectionProps {
  missing: MissingEmployee[]
  withoutActivity: import('../../types').EmployeeWithoutActivity[]
}

export function MissingEmployeesSection({ missing, withoutActivity }: MissingEmployeesSectionProps) {
  if (!missing?.length && !withoutActivity?.length) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {missing?.length > 0 && (
        <div className="rounded-xl border border-[#78350f] bg-[#18181b] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#78350f] flex items-center gap-2">
            <AlertTriangle size={14} className="text-[#f59e0b]" />
            <div>
              <h3 className="text-sm font-semibold text-[#f59e0b]">Missing Employees</h3>
              <p className="text-[11px] text-[#71717a]">Found in activity logs but not in master records</p>
            </div>
            <Badge variant="warning" size="sm">{missing.length}</Badge>
          </div>
          <div className="divide-y divide-[#27272a]">
            {missing.map((emp, i) => (
              <motion.div
                key={emp.employeeId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-3 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-mono font-semibold text-[#fbbf24]">{emp.employeeId}</p>
                  <p className="text-[11px] text-[#71717a] mt-0.5">{emp.reason}</p>
                  {emp.source && (
                    <p className="text-[10px] text-[#52525b] font-mono mt-0.5">Source: {emp.source}</p>
                  )}
                </div>
                <Badge variant="warning" size="sm">Missing</Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {withoutActivity?.length > 0 && (
        <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1c1c1f] flex items-center gap-2">
            <UserX size={14} className="text-[#71717a]" />
            <div>
              <h3 className="text-sm font-semibold text-[#a1a1aa]">No Activity Recorded</h3>
              <p className="text-[11px] text-[#52525b]">Employees in master with no activity data</p>
            </div>
            <Badge variant="default" size="sm">{withoutActivity.length}</Badge>
          </div>
          <div className="divide-y divide-[#1c1c1f]">
            {withoutActivity.map((emp, i) => (
              <motion.div
                key={emp.employeeId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-3 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-semibold text-[#e4e4e7]">{emp.name}</p>
                  <p className="text-[11px] text-[#71717a]">{emp.role} · {emp.department}</p>
                  <p className="text-[10px] font-mono text-[#52525b] mt-0.5">{emp.employeeId}</p>
                </div>
                <Badge
                  variant={emp.status === 'active' ? 'success' : 'default'}
                  size="sm"
                >
                  {emp.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
