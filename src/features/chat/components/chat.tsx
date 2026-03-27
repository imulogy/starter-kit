"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { UIMessage } from "ai"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { ChatSession } from "@/features/chat/components/chat-session/chat-session"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"
import { NEW_CHAT_EVENT_NAME } from "@/features/chat/constants/new-chat-event.constants"
import { useFetchChatDetail } from "@/features/chat/hooks/use-fetch-chat-detail"
import { useFetchChats } from "@/features/chat/hooks/use-fetch-chats"
import type { ChatProps } from "@/features/chat/types/chat.types"
import { Spinner } from "@/components/ui/spinner"

export function Chat({ initialChatId = null }: ChatProps) {
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)
  const isGuestResolved = !isSessionPending && !isAuthenticated
  const queryClient = useQueryClient()
  const chatsQuery = useFetchChats(isAuthenticated && !isSessionPending)

  const [routingReady, setRoutingReady] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId)
  const [sessionClientId, setSessionClientId] = useState("")
  const bootstrapModeRef = useRef<"guest" | "authenticated" | null>(null)
  const hasRefetchedChatsForSessionRef = useRef(false)
  const chatDetailQuery = useFetchChatDetail(activeChatId, isAuthenticated)

  const hydratedFromServer = Boolean(activeChatId) && sessionClientId === activeChatId
  const initialMessages: UIMessage[] = hydratedFromServer && chatDetailQuery.data ? chatDetailQuery.data.messages : []

  useEffect(() => {
    if (isSessionPending) {
      return
    }

    if (isGuestResolved) {
      if (bootstrapModeRef.current === "guest") {
        return
      }
      bootstrapModeRef.current = "guest"
      setActiveChatId(null)
      setSessionClientId(crypto.randomUUID())
      setRoutingReady(true)
      return
    }

    if (
      chatsQuery.isPending ||
      chatsQuery.isError ||
      !chatsQuery.isSuccess ||
      bootstrapModeRef.current === "authenticated"
    ) {
      return
    }

    bootstrapModeRef.current = "authenticated"
    queueMicrotask(() => {
      if (initialChatId) {
        setActiveChatId(initialChatId)
        setSessionClientId(initialChatId)
        setRoutingReady(true)
        return
      }

      setActiveChatId(null)
      setSessionClientId(crypto.randomUUID())
      setRoutingReady(true)
    })
  }, [
    chatsQuery.data,
    chatsQuery.isError,
    chatsQuery.isPending,
    chatsQuery.isSuccess,
    initialChatId,
    isGuestResolved,
    isSessionPending,
    router,
  ])

  useEffect(() => {
    if (!routingReady || isSessionPending) {
      return
    }

    if (initialChatId && activeChatId !== initialChatId) {
      setActiveChatId(initialChatId)
      setSessionClientId(initialChatId)
    }
  }, [activeChatId, initialChatId, isSessionPending, routingReady])

  useEffect(() => {
    const handleNewChat = () => {
      setActiveChatId(null)
      setSessionClientId(crypto.randomUUID())
    }

    window.addEventListener(NEW_CHAT_EVENT_NAME, handleNewChat)
    return () => {
      window.removeEventListener(NEW_CHAT_EVENT_NAME, handleNewChat)
    }
  }, [])

  useEffect(() => {
    if (!sessionClientId) {
      return
    }
    hasRefetchedChatsForSessionRef.current = false
  }, [sessionClientId])

  if (chatsQuery.isError) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center p-6 text-sm text-destructive">
        Could not load chats.
      </div>
    )
  }

  if (isSessionPending || !routingReady || !sessionClientId) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  const waitingForChatDetail =
    isAuthenticated && Boolean(activeChatId) && hydratedFromServer && chatDetailQuery.isPending

  return (
    <div className="flex h-[calc(100dvh-57px-4.5rem)] min-h-0 md:h-[calc(100dvh-57px)]">
      <main className="mx-auto flex min-h-0 max-w-3xl flex-1 flex-col">
        {waitingForChatDetail ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : (
          <ChatSession
            key={sessionClientId}
            sessionClientId={sessionClientId}
            isAuthenticated={isAuthenticated}
            initialDbChatId={activeChatId}
            initialMessages={initialMessages}
            onChatCreated={(id) => {
              setActiveChatId(id)
            }}
            onConversationUpdated={() => {
              if (!hasRefetchedChatsForSessionRef.current) {
                hasRefetchedChatsForSessionRef.current = true
                void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
              }
            }}
          />
        )}
      </main>
    </div>
  )
}
