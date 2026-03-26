"use client"

import { useQuery } from "@tanstack/react-query"

import { getChatApi } from "@/features/chat/api/chats.api"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"

export function useFetchChatDetail(chatId: string | null) {
  return useQuery({
    queryKey: chatQueryKeys.chat(chatId ?? ""),
    queryFn: () => getChatApi(chatId!),
    enabled: Boolean(chatId),
  })
}
