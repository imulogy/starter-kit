"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { UIMessage } from "ai"
import { useCallback, useEffect, useRef, useState } from "react"

import { ChatSession } from "@/features/chat/components/chat-session/chat-session"
import { ChatSidebar } from "@/features/chat/components/chat-sidebar/chat-sidebar"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"
import { useFetchChatDetail } from "@/features/chat/hooks/use-fetch-chat-detail"
import { useFetchChats } from "@/features/chat/hooks/use-fetch-chats"
import { useMutateDeleteChat } from "@/features/chat/hooks/use-mutate-delete-chat"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

export function Chat() {
  const queryClient = useQueryClient()
  const chatsQuery = useFetchChats()
  const deleteChatMutation = useMutateDeleteChat()

  const [routingReady, setRoutingReady] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [sessionClientId, setSessionClientId] = useState("")
  const [pendingDeleteChatId, setPendingDeleteChatId] = useState<string | null>(null)
  const bootstrapDoneRef = useRef(false)
  const chatDetailQuery = useFetchChatDetail(activeChatId)

  const chats = chatsQuery.data ?? []
  const hydratedFromServer = Boolean(activeChatId) && sessionClientId === activeChatId
  const initialMessages: UIMessage[] = hydratedFromServer && chatDetailQuery.data ? chatDetailQuery.data.messages : []

  const startNewDraft = useCallback(() => {
    setActiveChatId(null)
    setSessionClientId(crypto.randomUUID())
  }, [])

  const loadChat = useCallback((id: string) => {
    setActiveChatId(id)
    setSessionClientId(id)
  }, [])

  useEffect(() => {
    if (chatsQuery.isPending || chatsQuery.isError || !chatsQuery.isSuccess || bootstrapDoneRef.current) {
      return
    }
    bootstrapDoneRef.current = true
    const firstChat = (chatsQuery.data ?? [])[0]
    queueMicrotask(() => {
      if (firstChat) {
        setActiveChatId(firstChat.id)
        setSessionClientId(firstChat.id)
      } else {
        setActiveChatId(null)
        setSessionClientId(crypto.randomUUID())
      }
      setRoutingReady(true)
    })
  }, [chatsQuery.data, chatsQuery.isError, chatsQuery.isPending, chatsQuery.isSuccess])

  const executeDeleteChat = useCallback(
    async (id: string) => {
      try {
        await deleteChatMutation.mutateAsync(id)
      } catch {
        return
      }
      queryClient.removeQueries({ queryKey: chatQueryKeys.chat(id) })
      if (activeChatId === id) {
        startNewDraft()
      }
    },
    [activeChatId, deleteChatMutation, queryClient, startNewDraft]
  )

  if (chatsQuery.isError) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center p-6 text-sm text-destructive">
        Could not load chats.
      </div>
    )
  }

  if (!routingReady || !sessionClientId) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  const waitingForChatDetail = Boolean(activeChatId) && hydratedFromServer && chatDetailQuery.isPending

  return (
    <div className="flex h-[calc(100dvh-57px)] min-h-0 border-t">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={loadChat}
        onNewChat={startNewDraft}
        onDeleteChat={(id) => {
          setPendingDeleteChatId(id)
        }}
      />
      <main className="flex min-h-0 flex-1 flex-col">
        {waitingForChatDetail ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : (
          <ChatSession
            key={sessionClientId}
            sessionClientId={sessionClientId}
            initialDbChatId={activeChatId}
            initialMessages={initialMessages}
            onChatCreated={(id) => {
              setActiveChatId(id)
            }}
            onConversationUpdated={() => {
              void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
              if (activeChatId) {
                void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chat(activeChatId) })
              }
            }}
          />
        )}
      </main>
      <AlertDialog
        open={Boolean(pendingDeleteChatId)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteChatId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The chat and all of its messages will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteChatMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteChatMutation.isPending}
              onClick={() => {
                const chatId = pendingDeleteChatId
                if (!chatId) {
                  return
                }
                void executeDeleteChat(chatId)
                setPendingDeleteChatId(null)
              }}
            >
              {deleteChatMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
