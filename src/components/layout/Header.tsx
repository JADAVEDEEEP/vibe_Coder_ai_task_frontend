import { useState } from 'react'
import { Search, Download, Bell, Moon, Sun, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { exportPDF, downloadBlob } from '../../api/export'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuToggle?: () => void
}

export function Header({ title, subtitle, onMenuToggle }: HeaderProps) {
  const [dark, setDark] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [search, setSearch] = useState('')

  async function handleExport() {
    setExporting(true)
    try {
      const blob = await exportPDF()
      downloadBlob(blob, 'workforce-pulse-report.pdf')
    } catch (e) {
      console.error('Export failed', e)
    } finally {
      setExporting(false)
    }
  }

  return (
    <header className="h-14 fixed top-0 right-0 left-0 z-20 glass border-b border-[#1c1c1f] flex items-center px-4 sm:px-5 gap-3 md:left-[220px]">
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa] md:hidden"
      >
        <Menu size={16} />
      </button>

      <div className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-sm font-semibold text-[#fafafa] leading-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-[11px] text-[#52525b] font-mono mt-0.5">{subtitle}</p>
          )}
        </motion.div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#52525b]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="h-8 w-40 rounded-lg bg-[#18181b] border border-[#27272a] pl-7 pr-3 text-xs text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors sm:w-48"
          />
        </div>

        <button className="p-2 rounded-lg text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#18181b] transition-colors hidden sm:block">
          <Bell size={15} />
        </button>

        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#18181b] transition-colors hidden sm:block"
        >
          {dark ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        <button
          onClick={handleExport}
          className="p-2 rounded-lg text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#18181b] transition-colors sm:hidden"
          disabled={exporting}
        >
          <Download size={15} />
        </button>

        <Button
          variant="primary"
          size="sm"
          loading={exporting}
          icon={<Download size={13} />}
          onClick={handleExport}
          className="hidden sm:inline-flex"
        >
          Export PDF
        </Button>
      </div>
    </header>
  )
}
