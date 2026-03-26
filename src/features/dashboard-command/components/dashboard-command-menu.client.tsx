"use client"

import { SearchIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { dashboardCommandItems } from "@/features/dashboard-command/constants/dashboard-command-items.constants"
import type { DashboardCommandActionId } from "@/features/dashboard-command/types/dashboard-command-item.types"
import type { DashboardCommandMenuProps } from "@/features/dashboard-command/types/dashboard-command-menu.types"
import { useSettingsDialogStore } from "@/features/settings/store/settings-dialog.store"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function DashboardCommandMenu({ renderTrigger }: DashboardCommandMenuProps) {
  const [open, setOpen] = useState(false)
  const { setTheme } = useTheme()
  const router = useRouter()
  const openSettingsDialog = useSettingsDialogStore((state) => state.openDialog)

  const handleAction = (actionId?: DashboardCommandActionId) => {
    if (!actionId) return

    if (actionId === "open-settings") {
      openSettingsDialog("account")
    }

    if (actionId === "open-profile") {
      openSettingsDialog("account")
    }

    if (actionId === "open-notifications") {
      openSettingsDialog("notifications")
    }
  }

  return (
    <>
      {renderTrigger ? (
        renderTrigger(() => setOpen(true))
      ) : (
        <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
          <SearchIcon />
          Open Menu
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {dashboardCommandItems
                .filter((item) => item.kind === "route" || item.kind === "action")
                .map((item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => {
                      if (item.kind === "route" && item.path) {
                        router.push(item.path)
                      }

                      if (item.kind === "action") {
                        handleAction(item.actionId)
                      }

                      setOpen(false)
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Appearance">
              {dashboardCommandItems
                .filter((item) => item.kind === "theme")
                .map((item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => {
                      if (item.theme) {
                        setTheme(item.theme)
                      }
                      setOpen(false)
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
