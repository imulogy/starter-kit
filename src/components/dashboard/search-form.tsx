import { Search } from "lucide-react"

import { DashboardCommandMenu } from "@/features/dashboard-command/components/dashboard-command-menu.client"
import { Button } from "@/components/ui/button"

export function SearchForm() {
  return (
    <DashboardCommandMenu
      renderTrigger={(open) => (
        <Button
          variant="outline"
          className="text-chat-surface-foreground placeholder:text-chat-muted w-full justify-between border-none bg-transparent text-xs outline-none"
          onClick={open}
        >
          <div className="flex items-center gap-2">
            <Search className="size-3!" />
            <span>Search anything...</span>
          </div>
        </Button>
      )}
    />
  )
}
