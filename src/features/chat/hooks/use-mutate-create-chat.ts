"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createChatApi } from "@/features/chat/api/chats.api"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"

export function useMutateCreateChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChatApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
    },
  })
}
