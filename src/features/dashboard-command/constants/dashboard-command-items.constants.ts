import {
  BellIcon,
  HomeIcon,
  InboxIcon,
  MonitorIcon,
  MoonIcon,
  SettingsIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"

import type { DashboardCommandItem } from "@/features/dashboard-command/types/dashboard-command-item.types"
import { WebRoutes } from "@/lib/web.routes"

export const dashboardCommandItems: DashboardCommandItem[] = [
  { label: "Home", icon: HomeIcon, kind: "route", path: WebRoutes.root.path },
  { label: "Ask AI", icon: SparklesIcon, kind: "route", path: WebRoutes.askAi.path },
  { label: "Inbox", icon: InboxIcon, kind: "route", path: WebRoutes.inbox.path },
  { label: "Settings", icon: SettingsIcon, kind: "route", path: WebRoutes.root.path },
  { label: "Profile", icon: UserIcon, kind: "route", path: WebRoutes.root.path },
  { label: "Notifications", icon: BellIcon, kind: "route", path: WebRoutes.root.path },
  { label: "Dark mode", icon: MoonIcon, kind: "theme", theme: "dark" },
  { label: "Light mode", icon: SunIcon, kind: "theme", theme: "light" },
  { label: "System theme", icon: MonitorIcon, kind: "theme", theme: "system" },
]
