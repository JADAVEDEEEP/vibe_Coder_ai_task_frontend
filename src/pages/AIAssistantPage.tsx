import { Layout } from '../components/layout/Layout'
import { AIAssistant } from '../components/ai/AIAssistant'

export default function AIAssistantPage() {
  return (
    <Layout
      title="AI Assistant"
      subtitle="Workforce analytics · Grounded on verified data"
    >
      <div className="rounded-xl border border-[#1c1c1f] bg-[#111113] overflow-hidden" style={{ height: 'calc(100vh - 130px)' }}>
        <AIAssistant />
      </div>
    </Layout>
  )
}
