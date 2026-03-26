"use client"

import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useState } from "react"

import { dashboardCommandItems } from "@/features/dashboard-command/constants/dashboard-command-items.constants"
import type { DashboardCommandMenuProps } from "@/features/dashboard-command/types/dashboard-command-menu.types"
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
                .filter((item) => item.kind === "route")
                .map((item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => {
                      if (item.path) {
                        router.push(item.path)
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
