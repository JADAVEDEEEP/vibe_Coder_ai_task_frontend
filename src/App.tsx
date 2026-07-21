import { Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import EmployeesPage from './pages/EmployeesPage'
import EmployeeDrilldownPage from './pages/EmployeeDrilldownPage'
import AIAssistantPage from './pages/AIAssistantPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/employees/:employeeId" element={<EmployeeDrilldownPage />} />
      <Route path="/ai" element={<AIAssistantPage />} />
    </Routes>
  )
}
