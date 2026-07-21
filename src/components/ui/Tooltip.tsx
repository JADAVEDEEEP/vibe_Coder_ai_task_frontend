import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap rounded-md bg-[#27272a] border border-[#3f3f46] px-2.5 py-1.5 text-xs text-[#e4e4e7] shadow-xl pointer-events-none"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
