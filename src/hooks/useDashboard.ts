import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '../api/dashboard'
import type { DashboardData } from '../types'

export function useDashboard() {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

