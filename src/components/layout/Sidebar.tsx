import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Bot, TrendingUp, ChevronRight, X } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/ai', icon: Bot, label: 'AI Assistant' },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed left-0 top-0 h-full w-[220px] bg-[#0d0d0f] border-r border-[#1c1c1f] z-30 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#1c1c1f]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <TrendingUp size={14} className="text-white" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#fafafa] leading-none">Workforce</div>
            <div className="text-[10px] text-[#6366f1] font-mono tracking-widest uppercase mt-0.5">Pulse</div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="rounded-lg p-1.5 text-[#52525b] hover:bg-[#18181b] hover:text-[#fafafa] md:hidden"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <p className="text-[10px] font-mono text-[#3f3f46] uppercase tracking-widest px-2 mb-3">Navigation</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#1e1b4b] text-[#818cf8] font-medium'
                  : 'text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#18181b]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-[#818cf8]' : 'text-[#52525b] group-hover:text-[#a1a1aa]'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={12} className="text-[#6366f1]" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#1c1c1f]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-[11px] font-bold text-white">
            C
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#e4e4e7]">COO View</div>
            <div className="text-[10px] text-[#52525b]">Executive</div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
