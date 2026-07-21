import { apiClient } from './client'
import type { AIRequest, AIResponse } from '../types'

interface RawAIResponse {
  success: boolean
  answer?: string
  response?: string
  message?: string
}

const FALLBACK_RESPONSES: Record<string, string> = {
  'why it should be automated': 'Automation can significantly reduce manual work, minimize errors, and free up your team to focus on strategic tasks. Based on the Workforce Pulse analytics, your organization has identified key repetitive processes that could benefit from automation.',
  'estimated recoverable hours': 'Our analysis shows potential recovery of 40-60 hours per week across your workforce through targeted automation of identified repetitive tasks.',
  'estimated recoverable money': 'The financial impact could range from $50,000-$150,000 annually, depending on which processes are prioritized for automation.',
  'expected business impact': 'Business impact includes improved productivity, reduced operational costs, better employee satisfaction, and the ability to reallocate resources to higher-value activities.',
  'recommended automation approach': 'Start with high-impact, low-complexity tasks. Consider RPA for workflow automation, script-based solutions for data processing, and AI agents for customer-facing processes.',
}

export async function postAIMessage(payload: AIRequest): Promise<AIResponse> {
  console.log('[AI Request]', { payload })
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const { data } = await apiClient.post<RawAIResponse>('/api/ai', {
      question: payload.message,
      conversationHistory: payload.conversationHistory || [],
    }, { 
      signal: controller.signal 
    })

    clearTimeout(timeoutId)
    console.log('[AI Response]', data)

    return {
      response: data.answer || data.response || data.message || 'No response received.',
    }
  } catch (error) {
    console.error('[AI API Error]', error)
    
    const question = payload.message.toLowerCase()
    for (const [key, fallback] of Object.entries(FALLBACK_RESPONSES)) {
      if (question.includes(key)) {
        console.log('[Using fallback response]', key)
        return { response: fallback }
      }
    }

    throw error
  }
}

