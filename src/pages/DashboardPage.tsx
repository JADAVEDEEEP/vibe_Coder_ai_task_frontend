import { Clock, DollarSign, Zap, Building2, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Layout } from '../components/layout/Layout'
import { KPICard } from '../components/dashboard/KPICard'
import { EngineeringInsightPanel } from '../components/dashboard/EngineeringInsightPanel'
import { MissingEmployeesSection } from '../components/dashboard/MissingEmployeesSection'
import { AutomationTable } from '../components/dashboard/AutomationTable'
import { AIInsightCard } from '../components/dashboard/AIInsightCard'
import { DepartmentChart } from '../components/charts/DepartmentChart'
import { TaskBreakdownChart } from '../components/charts/TaskBreakdownChart'
import { ApplicationChart } from '../components/charts/ApplicationChart'
import { WeeklyTrendChart } from '../components/charts/WeeklyTrendChart'
import { AutomationRankingChart } from '../components/charts/AutomationRankingChart'
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton'
import { useDashboard } from '../hooks/useDashboard'

function ChartCard({ title, subtitle, children, insight }: {
  title: string
  subtitle?: string
  children: React.ReactNode
  insight?: string
}) {
  return (
    <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] overflow-hidden">
      <div className="px-5 pt-5 pb-0">
        <h3 className="text-sm font-semibold text-[#fafafa]">{title}</h3>
        {subtitle && <p className="text-[11px] text-[#52525b] mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-4 py-4">{children}</div>
      {insight && (
        <div className="px-4 pb-4">
          <AIInsightCard insight={insight} />
        </div>
      )}
    </div>
  )
}

function deriveDepartmentInsight(data: import('../types').DashboardData): string {
  if (!data.departments?.length) return ''
  const top = [...data.departments].sort((a, b) => b.recoverableHours - a.recoverableHours)[0]
  if (!top) return ''
  const total = data.departments.reduce((s, d) => s + d.recoverableHours, 0)
  const pct = total > 0 ? ((top.recoverableHours / total) * 100).toFixed(0) : '0'
  return `${top.name} accounts for ${pct}% of total recoverable hours (${top.recoverableHours.toFixed(1)}h). This represents the highest automation opportunity across all departments.`
}

function deriveTaskInsight(data: import('../types').DashboardData): string {
  if (!data.taskBreakdown?.length) return ''
  const rep = data.taskBreakdown.filter((t) => t.isRepetitive)
  if (!rep.length) return ''
  const top = rep.sort((a, b) => b.count - a.count)[0]
  return `"${top.task}" is the most frequent repetitive task with ${top.count} occurrences (${top.percentage?.toFixed(1)}% of all activity). Automating this alone could free significant productive capacity.`
}

function deriveAppInsight(data: import('../types').DashboardData): string {
  if (!data.applicationBreakdown?.length) return ''
  const top = data.applicationBreakdown[0]
  return `${top.application} is the most-used application (${top.percentage?.toFixed(1)}% of activity). ${top.automationPotential === 'high' ? 'It carries high automation potential — targeted scripting or RPA could reclaim this time.' : 'Workflow integrations here would have the broadest impact.'}`
}

function deriveWeeklyInsight(data: import('../types').DashboardData): string {
  if (!data.weeklyTrend?.length) return ''
  const sorted = [...data.weeklyTrend].sort((a, b) => b.recoverableHours - a.recoverableHours)
  const peak = sorted[0]
  return `Peak recoverable hours occurred in week ${peak.week} (${peak.recoverableHours.toFixed(1)}h). Consistent weekly patterns indicate systematic inefficiencies suitable for process automation.`
}

function deriveAutomationInsight(data: import('../types').DashboardData): string {
  if (!data.automationRanking?.length) return ''
  const high = data.automationRanking.filter((r) => r.priority === 'high')
  if (!high.length) return ''
  const totalMoney = high.reduce((s, r) => s + (r.recoverableMoney ?? 0), 0)
  return `${high.length} task categories are flagged as high-priority automation candidates, representing $${Math.round(totalMoney).toLocaleString()} in combined recoverable cost. Addressing these first would yield the fastest ROI.`
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (isLoading) {
    return (
      <Layout title="Dashboard" subtitle="Workforce Analytics · Loading…">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonChart key={i} />)}
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Dashboard" subtitle="Error loading data">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-[#ef4444] font-semibold mb-1">Failed to load dashboard</p>
            <p className="text-xs text-[#52525b]">{(error as Error).message}</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!data) return null

  const s = data.summary

  return (
    <Layout
      title="Workforce Analytics Dashboard"
      subtitle={`${s.totalEmployees} employees · ${s.totalDepartments} departments · Live data`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <KPICard
            label="Recoverable Hours"
            value={`${s.totalRecoverableHours?.toFixed(1)}h`}
            subtext="Across all employees"
            tooltip="Total hours that could be saved through task automation"
            icon={<Clock size={15} />}
            accentColor="#38bdf8"
            formula="Σ(repetitive_task_count × avg_task_duration) per employee"
            businessReasoning="Every recoverable hour represents time currently spent on tasks that a workflow, script, or RPA bot could handle. Leadership uses this to size automation investment."
            trustStatement="Calculated only from activity logs that have been normalized and joined to verified employee records. No raw CSV values are used directly."
            steps={[
              { label: 'Identify Repetitive Tasks', content: 'Activities classified as repetitive based on task category and occurrence frequency threshold.' },
              { label: 'Estimate Duration', content: 'Average duration per task type derived from normalized activity timestamps.' },
              { label: 'Aggregate', content: 'Sum across all qualifying employees after deduplication.' },
            ]}
          />
          <KPICard
            label="Recoverable Money"
            value={`$${Math.round(s.totalRecoverableMoney ?? 0).toLocaleString()}`}
            subtext="Cost savings potential"
            tooltip="Dollar value of recoverable hours based on fully-loaded employee cost"
            icon={<DollarSign size={15} />}
            accentColor="#22c55e"
            formula="Recoverable Hours × (Annual Salary / 2080 working hours)"
            businessReasoning="Converts time waste into dollar terms that resonate with the CFO and ops leadership. Provides a clear ROI numerator for automation investment proposals."
            trustStatement="Salary data sourced from employee master records. Division by 2080 assumes standard full-time employment; partial adjustments made for part-time employees."
            steps={[
              { label: 'Fetch Compensation', content: 'Per-employee salary from verified master records.' },
              { label: 'Compute Hourly Rate', content: 'Annual salary ÷ 2080 (52 weeks × 40 hours).' },
              { label: 'Multiply by Recoverable Hours', content: 'Hourly rate × recoverable hours per employee, then summed.' },
            ]}
          />
          <KPICard
            label="Automation Opportunities"
            value={s.automationOpportunities?.toString()}
            subtext="Actionable candidates"
            tooltip="Number of distinct automation opportunities identified across the workforce"
            icon={<Zap size={15} />}
            accentColor="#f59e0b"
            formula="COUNT(employees WHERE automation_score ≥ threshold AND repetitive_hours > 0)"
            businessReasoning="Identifies the pipeline of employees or process clusters where automation tooling (RPA, AI agents, scripts) would have a measurable impact."
            trustStatement="Threshold is calibrated against industry benchmarks. Score combines repetitive task frequency, duration, and task category standardizability."
          />
          <KPICard
            label="Departments"
            value={s.totalDepartments?.toString()}
            subtext={`Top: ${s.topAutomationDepartment}`}
            tooltip="Number of departments with automation data"
            icon={<Building2 size={15} />}
            accentColor="#a855f7"
            formula="COUNT(DISTINCT department) WHERE activity_count > 0"
            businessReasoning="Provides cross-departmental coverage. The top automation department is the highest-priority target for initial automation pilots."
            trustStatement="Department assignments are sourced from HR master records, not inferred from activity data."
          />
          <KPICard
            label="Employees"
            value={`${s.activeEmployees} / ${s.totalEmployees}`}
            subtext="Active with activity data"
            tooltip="Active employees out of total headcount with recorded activities"
            icon={<Users size={15} />}
            accentColor="#6366f1"
            formula="COUNT(employees WHERE activity_count > 0) / total_employees"
            businessReasoning="Coverage ratio indicates data completeness. A high active/total ratio means analytics are representative of the full workforce."
            trustStatement="Both counts are derived from the joined employee+activity dataset. Employees without activity are listed separately in the data integrity section."
          />
        </div>

        <EngineeringInsightPanel dataIntegrity={data.dataIntegrity} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard
            title="Department Breakdown"
            subtitle="Recoverable hours by department"
            insight={deriveDepartmentInsight(data)}
          >
            <DepartmentChart data={data.departments ?? []} />
          </ChartCard>

          <ChartCard
            title="Task Breakdown"
            subtitle="Activity distribution across task categories"
            insight={deriveTaskInsight(data)}
          >
            <TaskBreakdownChart data={data.taskBreakdown ?? []} />
          </ChartCard>

          <ChartCard
            title="Application Usage"
            subtitle="Top applications by activity volume"
            insight={deriveAppInsight(data)}
          >
            <ApplicationChart data={data.applicationBreakdown ?? []} />
          </ChartCard>

          <ChartCard
            title="Weekly Trend"
            subtitle="Recoverable hours over time"
            insight={deriveWeeklyInsight(data)}
          >
            <WeeklyTrendChart data={data.weeklyTrend ?? []} />
          </ChartCard>
        </div>

        <ChartCard
          title="Automation Ranking — Top Candidates"
          subtitle="Employees ranked by recoverable cost"
          insight={deriveAutomationInsight(data)}
        >
          <AutomationRankingChart data={data.automationRanking ?? []} />
        </ChartCard>

        {data.automationRanking?.length > 0 && (
          <AutomationTable data={data.automationRanking} />
        )}

        <MissingEmployeesSection
          missing={data.missingEmployees ?? []}
          withoutActivity={data.employeesWithoutActivity ?? []}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between text-[10px] font-mono text-[#3f3f46] pt-2 border-t border-[#1c1c1f]"
        >
          <span>Workforce Pulse · AI-Powered Analytics</span>
          <span className="flex items-center gap-1.5">
            <TrendingUp size={10} />
            Data refreshed on load · Avg score: {s.averageAutomationScore?.toFixed(1)}
          </span>
        </motion.div>
      </div>
    </Layout>
  )
}
