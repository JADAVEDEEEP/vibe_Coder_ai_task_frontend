import { useState, useRef, useEffect } from 'react'
import { Send, Copy, Check, Sparkles, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useAI } from '../../hooks/useAI'
import type { AIMessage } from '../../types'

const SUGGESTED = [
  'Why it should be automated',
  'Estimated recoverable hours',
  'Estimated recoverable money',
  'Expected business impact',
  'Recommended automation approach',
]

export function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { mutate: sendMessage, isPending } = useAI()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  function handleSend(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || isPending) return

    const userMsg: AIMessage = { role: 'user', content: msg, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    const history = messages.map((m) => ({ role: m.role, content: m.content }))

    sendMessage(
      { message: msg, conversationHistory: history },
      {
        onSuccess: (data) => {
          const assistantMsg: AIMessage = {
            role: 'assistant',
            content: data.response || 'No response received.',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMsg])
        },
        onError: (error) => {
          console.error('[AI Error]', error)
          const errorMsg = error instanceof Error ? error.message : 'Unknown error'
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `Error: ${errorMsg}. Backend may be unavailable. Please check your internet connection or try again later.`,
              timestamp: new Date(),
            },
          ])
        },
      }
    )
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full gap-6 py-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-xl shadow-indigo-900/30">
              <Sparkles size={22} className="text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-[#fafafa]">Workforce AI Assistant</h3>
              <p className="text-sm text-[#52525b] mt-1 max-w-sm">
                Ask anything about workforce analytics, automation opportunities, or employee performance.
                All answers are grounded in verified data.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs text-[#a1a1aa] bg-[#18181b] border border-[#27272a] hover:border-[#6366f1] hover:text-[#e4e4e7] rounded-lg px-3 py-2.5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={13} className="text-white" />
                </div>
              )}

              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1e1b4b] border border-[#312e81] text-[#e4e4e7] rounded-tr-sm'
                      : 'bg-[#18181b] border border-[#27272a] text-[#e4e4e7] rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1.5 px-1">
                  <span className="text-[10px] font-mono text-[#3f3f46]">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, i)}
                      className="text-[#3f3f46] hover:text-[#71717a] transition-colors"
                    >
                      {copiedIndex === i ? (
                        <Check size={11} className="text-[#22c55e]" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#27272a] flex items-center justify-center shrink-0 mt-0.5">
                  <User size={13} className="text-[#a1a1aa]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#1c1c1f] p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask about workforce analytics..."
              rows={1}
              className="w-full resize-none rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#6366f1] px-4 py-3 text-sm text-[#e4e4e7] placeholder:text-[#3f3f46] focus:outline-none transition-colors leading-relaxed"
              style={{ maxHeight: 120, overflowY: 'auto' }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isPending}
            className="w-10 h-10 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-[#3f3f46] mt-2 text-center font-mono">
          Grounded on verified workforce analytics · Press Enter to send
        </p>
      </div>
    </div>
  )
}
