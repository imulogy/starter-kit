import type { UIMessage } from "ai"

export type ChatSessionProps = {
  sessionClientId: string
  isAuthenticated?: boolean
  initialMessages: UIMessage[]
  initialDbChatId: string | null
  onChatCreated: (id: string) => void
  onConversationUpdated: () => void
}
