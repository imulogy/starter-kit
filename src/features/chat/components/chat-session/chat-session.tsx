"use client"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@/components/ai-elements/prompt-input"
import { AssistantThinkingIndicator } from "@/features/chat/components/chat-session/assistant-thinking-indicator"
import { ChatExamplePrompts } from "@/features/chat/components/chat-session/chat-example-prompts"
import { useMutateCreateChat } from "@/features/chat/hooks/use-mutate-create-chat"
import type { ChatSessionProps } from "@/features/chat/types/chat-session.types"
import { createStableChatTransport } from "@/features/chat/utils/stable-chat-transport"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function ChatSession({
  sessionClientId,
  initialMessages,
  initialDbChatId,
  onChatCreated,
  onConversationUpdated,
}: ChatSessionProps) {
  const [transportApi] = useState(() => createStableChatTransport())
  const createChatMutation = useMutateCreateChat()

  useEffect(() => {
    transportApi.setChatId(initialDbChatId)
  }, [initialDbChatId, transportApi])

  const { messages, sendMessage, status, stop } = useChat({
    id: sessionClientId,
    messages: initialMessages,
    transport: transportApi.transport,
    onFinish: () => {
      onConversationUpdated()
    },
  })

  const isGenerating = status === "submitted" || status === "streaming"
  const lastIndex = messages.length - 1

  const handleSubmit = async ({ text }: { text: string }) => {
    if (!text.trim() || isGenerating) {
      return
    }
    if (!transportApi.getChatId()) {
      try {
        const created = await createChatMutation.mutateAsync()
        transportApi.setChatId(created.id)
        onChatCreated(created.id)
      } catch {
        return
      }
    }
    void sendMessage({ text })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="flex min-h-full flex-col">
          {messages.length === 0 ? (
            <ConversationEmptyState className="min-h-0 flex-1">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-background">
                <Sparkles className="size-4" strokeWidth={1.75} />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">How can I help you?</h3>
                <p className="max-w-md text-sm text-muted-foreground">Chat with AI, keep history, and resume any previous conversation.</p>
              </div>
            </ConversationEmptyState>
          ) : null}

          {messages.map((message, index) => (
            <Message
              key={message.id}
              from={message.role}
              className={cn(message.role === "user" && "w-fit max-w-[min(100%,32rem)] justify-end")}
            >
              <MessageContent className={cn(message.role === "user" ? "min-w-0 flex-col gap-3" : "flex w-full min-w-0 flex-col gap-3")}>
                {message.parts.map((part, partIndex) => {
                  if (part.type !== "text") {
                    return null
                  }
                  const isUser = message.role === "user"
                  return (
                    <div key={partIndex} className={cn("block min-w-0 shrink-0", isUser ? "max-w-full" : "w-full min-w-0")}>
                      <MessageResponse
                        className={cn("block min-w-0", isUser ? "max-w-full" : "w-full")}
                        isAnimating={status === "streaming" && index === lastIndex && message.role === "assistant"}
                      >
                        {part.text}
                      </MessageResponse>
                    </div>
                  )
                })}
              </MessageContent>
            </Message>
          ))}

          {status === "submitted" ? (
            <Message from="assistant">
              <MessageContent>
                <AssistantThinkingIndicator />
              </MessageContent>
            </Message>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className={cn("shrink-0 bg-background px-4 pb-4", messages.length === 0 ? "pt-2" : "pt-3")}>
        {messages.length === 0 ? (
          <ChatExamplePrompts
            disabled={isGenerating || createChatMutation.isPending}
            onSelect={(text) => {
              void handleSubmit({ text })
            }}
          />
        ) : null}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea placeholder="Ask me anything..." />
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit onStop={stop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
