import { apiClient } from './client'
import type { EmployeeDetail } from '../types'

interface RawEmployeeResponse {
  success: boolean
  summary: {
    employeeId: string
    name: string
    department: string
    role: string
    hourlyRate: number
    totalHours: number
    repetitiveHours: number
  }
  topTasks: { task: string; hours: number }[]
  topRepetitiveTasks: { task: string; hours: number }[]
  peerComparison: {
    employeeHours: number
    peerAverageHours: number
    employeeRepetitiveHours: number
    peerAverageRepetitiveHours: number
    sameRoleEmployees: number
    employeeRank: number
  }
}

function transformEmployee(raw: RawEmployeeResponse): EmployeeDetail {
  const s = raw.summary
  const recoverableMoney = s.repetitiveHours * s.hourlyRate

  const totalTaskHours = raw.topTasks.reduce((acc, t) => acc + t.hours, 0)

  return {
    employeeId: s.employeeId,
    name: s.name,
    role: s.role,
    department: s.department,
    status: 'active',
    summary: {
      totalActivities: Math.round(s.totalHours * 4),
      recoverableHours: s.repetitiveHours,
      recoverableMoney,
      automationScore: Math.min(100, Math.round((s.repetitiveHours / Math.max(1, s.totalHours)) * 100)),
      mostUsedApp: undefined,
    },
    topTasks: raw.topTasks.map((t) => ({
      task: t.task,
      count: Math.round(t.hours * 4),
      percentage: totalTaskHours > 0 ? (t.hours / totalTaskHours) * 100 : 0,
      category: t.task,
      duration: t.hours,
    })),
    topRepetitiveTasks: raw.topRepetitiveTasks.map((t) => ({
      task: t.task,
      count: Math.round(t.hours * 4),
      recoverableHours: t.hours,
      automationPotential: t.hours > 5 ? 'high' : t.hours > 2 ? 'medium' : 'low',
      suggestion: `Automate "${t.task}" via workflow script or RPA to reclaim ${t.hours.toFixed(1)}h`,
    })),
    peerComparison: {
      departmentAvgRecoverableHours: raw.peerComparison.peerAverageRepetitiveHours,
      departmentAvgAutomationScore: Math.min(
        100,
        Math.round(
          (raw.peerComparison.peerAverageRepetitiveHours /
            Math.max(1, raw.peerComparison.peerAverageHours)) * 100
        )
      ),
      percentileRank: raw.peerComparison.sameRoleEmployees > 1
        ? Math.round(
            ((raw.peerComparison.sameRoleEmployees - raw.peerComparison.employeeRank) /
              raw.peerComparison.sameRoleEmployees) * 100
          )
        : 50,
      benchmark:
        raw.peerComparison.employeeRepetitiveHours > raw.peerComparison.peerAverageRepetitiveHours
          ? 'Above Average'
          : 'Below Average',
    },
  }
}

export async function fetchEmployee(employeeId: string): Promise<EmployeeDetail> {
  const { data } = await apiClient.get<RawEmployeeResponse>(`/api/employees/${employeeId}`)
  return transformEmployee(data)
}
