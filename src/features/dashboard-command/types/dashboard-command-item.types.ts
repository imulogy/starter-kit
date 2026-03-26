import type { LucideIcon } from "lucide-react"
import type { Route } from "next"

export type DashboardCommandItemKind = "route" | "theme"

export type DashboardCommandItem = {
  label: string
  icon: LucideIcon
  kind: DashboardCommandItemKind
  path?: Route
  theme?: "light" | "dark" | "system"
}
