"use client"

import { Button } from "@/components/ui/button"
import { CHAT_EXAMPLE_PROMPTS } from "@/features/chat/constants/chat-example-prompts.constants"
import type { ChatExamplePromptsProps } from "@/features/chat/types/chat-example-prompts.types"

export function ChatExamplePrompts({ disabled = false, onSelect }: ChatExamplePromptsProps) {
  return (
    <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {CHAT_EXAMPLE_PROMPTS.map((prompt) => (
        <Button
          key={prompt}
          variant="outline"
          type="button"
          disabled={disabled}
          className="h-auto min-h-10 justify-start px-3 py-2 text-left text-xs font-normal whitespace-normal text-muted-foreground hover:text-foreground"
          onClick={() => {
            onSelect(prompt)
          }}
        >
          {prompt}
        </Button>
      ))}
    </div>
  )
}
