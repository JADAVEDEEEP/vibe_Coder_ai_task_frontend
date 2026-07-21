export interface DashboardData {
  summary: {
    totalEmployees: number
    activeEmployees: number
    totalRecoverableHours: number
    totalRecoverableMoney: number
    automationOpportunities: number
    totalDepartments: number
    averageAutomationScore: number
    topAutomationDepartment: string
  }
  departments: Department[]
  taskBreakdown: TaskBreakdown[]
  applicationBreakdown: ApplicationBreakdown[]
  weeklyTrend: WeeklyTrend[]
  automationRanking: AutomationRanking[]
  missingEmployees: MissingEmployee[]
  employeesWithoutActivity: EmployeeWithoutActivity[]
  dataIntegrity: DataIntegrity
}

export interface Department {
  name: string
  employeeCount: number
  recoverableHours: number
  recoverableMoney: number
  automationScore: number
  topTask?: string
}

export interface TaskBreakdown {
  task: string
  count: number
  percentage: number
  category: string
  isRepetitive: boolean
}

export interface ApplicationBreakdown {
  application: string
  usageCount: number
  percentage: number
  automationPotential: string
}

export interface WeeklyTrend {
  week: string
  recoverableHours: number
  activeEmployees: number
  automationOpportunities: number
}

export interface AutomationRanking {
  employeeId: string
  name: string
  department: string
  role: string
  recoverableHours: number
  recoverableMoney: number
  automationScore: number
  priority: 'high' | 'medium' | 'low'
  topRepetitiveTask: string
}

export interface MissingEmployee {
  employeeId: string
  reason: string
  source: string
  detectedAt?: string
}

export interface EmployeeWithoutActivity {
  employeeId: string
  name: string
  role: string
  department: string
  status: string
  lastSeen?: string
}

export interface DataIntegrity {
  totalRawActivities: number
  normalizedActivities: number
  joinedRecords: number
  duplicatesRemoved: number
  missingEmployeeCount: number
  extraEmployeeCount: number
  dataQualityScore: number
}

export interface EmployeeDetail {
  employeeId: string
  name: string
  role: string
  department: string
  email?: string
  joinDate?: string
  status: string
  summary: EmployeeSummary
  topTasks: TopTask[]
  topRepetitiveTasks: RepetitiveTask[]
  peerComparison: PeerComparison
  activityTimeline?: ActivityDay[]
  applicationUsage?: AppUsage[]
}

export interface EmployeeSummary {
  totalActivities: number
  recoverableHours: number
  recoverableMoney: number
  automationScore: number
  productivityScore?: number
  mostUsedApp?: string
  peakWorkHour?: number
}

export interface TopTask {
  task: string
  count: number
  percentage: number
  category: string
  duration?: number
}

export interface RepetitiveTask {
  task: string
  count: number
  recoverableHours: number
  automationPotential: string
  suggestion?: string
}

export interface PeerComparison {
  departmentAvgRecoverableHours: number
  departmentAvgAutomationScore: number
  percentileRank: number
  benchmark: string
}

export interface ActivityDay {
  date: string
  count: number
  hours?: number
}

export interface AppUsage {
  application: string
  usageCount: number
  percentage: number
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AIRequest {
  message: string
  conversationHistory?: { role: string; content: string }[]
}

export interface AIResponse {
  response: string
  groundedData?: Record<string, unknown>
}
