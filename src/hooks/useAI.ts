import { useMutation } from '@tanstack/react-query'
import { postAIMessage } from '../api/ai'
import type { AIRequest, AIResponse } from '../types'

export function useAI() {
  return useMutation<AIResponse, Error, AIRequest>({
    mutationFn: postAIMessage,
  })
}

