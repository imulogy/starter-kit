"use client"

import { useQuery } from "@tanstack/react-query"

import { listChatsApi } from "@/features/chat/api/chats.api"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"

export function useFetchChats() {
  return useQuery({
    queryKey: chatQueryKeys.chats(),
    queryFn: listChatsApi,
  })
}
