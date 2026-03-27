import { Search } from "lucide-react"

import { DashboardCommandMenu } from "@/features/dashboard-command/components/dashboard-command-menu.client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SearchForm({ className }: { className?: string }) {
  return (
    <DashboardCommandMenu
      renderTrigger={(open) => (
        <div className={className}>
          <div className="relative">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <Input
              id="search"
              role="button"
              readOnly
              value=""
              onClick={open}
              onFocus={open}
              placeholder="Search..."
              className="h-9 cursor-pointer pr-16 pl-8"
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ⌘ + K
            </kbd>
          </div>
        </div>
      )}
    />
  )
}
