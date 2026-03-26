"use client"

import { Button } from "@/components/ui/button"
import type { ChatSidebarProps } from "@/features/chat/types/chat-sidebar.types"
import { MessageCircleIcon, PlusIcon, Trash2Icon } from "lucide-react"

export function ChatSidebar({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat }: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r md:w-72">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MessageCircleIcon className="size-4" />
          AI Chat
        </div>
        <Button type="button" size="icon" variant="ghost" onClick={onNewChat} aria-label="New chat">
          <PlusIcon className="size-4" />
        </Button>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {chats.length === 0 ? <p className="px-2 py-1 text-xs text-muted-foreground">No chats yet.</p> : null}
        {chats.map((chat) => {
          const label = chat.title?.trim() || "Untitled chat"
          const isActive = activeChatId === chat.id
          return (
            <div key={chat.id} className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onSelectChat(chat.id)
                }}
                className={`min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  isActive ? "bg-muted font-medium" : "hover:bg-muted/60"
                }`}
                title={label}
              >
                {label}
              </button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-7 opacity-60 hover:opacity-100"
                onClick={() => {
                  onDeleteChat(chat.id)
                }}
                aria-label="Delete chat"
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
