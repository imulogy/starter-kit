import type { ChatListItem } from "@/features/chat/types/chat-list.types"

export type ChatSidebarProps = {
  chats: ChatListItem[]
  activeChatId: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
}
