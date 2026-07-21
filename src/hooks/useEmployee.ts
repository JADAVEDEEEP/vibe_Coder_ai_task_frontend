import { useQuery } from '@tanstack/react-query'
import { fetchEmployee } from '../api/employee'
import type { EmployeeDetail } from '../types'

export function useEmployee(employeeId: string) {
  return useQuery<EmployeeDetail, Error>({
    queryKey: ['employee', employeeId],
    queryFn: () => fetchEmployee(employeeId),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

