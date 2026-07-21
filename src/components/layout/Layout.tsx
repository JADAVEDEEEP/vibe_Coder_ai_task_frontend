import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-[1px] md:hidden"
        />
      )}

      <Header
        title={title}
        subtitle={subtitle}
        onMenuToggle={() => setMobileSidebarOpen((open) => !open)}
      />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="pt-14 min-h-screen md:ml-[220px]"
      >
        <div className="p-3 sm:p-4 lg:p-6">
          {children}
        </div>
      </motion.main>
    </div>
  )
}
