import { create } from "zustand"

import type { ChatNavigationStore } from "@/features/chat/types/chat-navigation.types"

export const useChatNavigationStore = create<ChatNavigationStore>((set) => ({
  activeChatId: null,
  setActiveChatId: (chatId) =>
    set({
      activeChatId: chatId,
    }),
}))
