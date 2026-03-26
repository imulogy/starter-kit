import { Search } from "lucide-react"

import { DashboardCommandMenu } from "@/features/dashboard-command/components/dashboard-command-menu.client"
import { Label } from "@/components/ui/label"
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <DashboardCommandMenu
      renderTrigger={(open) => (
        <form {...props}>
          <SidebarGroup className="pt-4">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <SidebarInput
                id="search"
                role="button"
                readOnly
                value=""
                onClick={open}
                onFocus={open}
                placeholder="Search everything..."
                className="cursor-pointer pl-8"
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      )}
    />
  )
}
