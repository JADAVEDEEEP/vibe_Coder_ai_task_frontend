import { useParams } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { EmployeeProfile } from '../components/employee/EmployeeProfile'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useEmployee } from '../hooks/useEmployee'

export default function EmployeeDrilldownPage() {
  const { employeeId } = useParams<{ employeeId: string }>()
  const { data, isLoading, error } = useEmployee(employeeId ?? '')

  if (isLoading) {
    return (
      <Layout title="Employee Profile" subtitle="Loading…">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </Layout>
    )
  }

  if (error || !data) {
    return (
      <Layout title="Employee Not Found" subtitle={employeeId}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-[#ef4444] font-semibold mb-1">Employee data unavailable</p>
            <p className="text-xs text-[#52525b]">{(error as Error)?.message || `No data found for ${employeeId}`}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={data.name || data.employeeId}
      subtitle={[data.role, data.department].filter(Boolean).join(' · ')}
    >
      <EmployeeProfile employee={data} />
    </Layout>
  )
}
