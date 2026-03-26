import { Bell, FileText, Languages, Palette, Settings, User, type LucideIcon } from "lucide-react"

import type { SettingsNavNameKey, SettingsSectionId } from "@/features/settings/types/settings-dialog.types"

export const settingsNavItems: {
  id: SettingsSectionId
  nameKey: SettingsNavNameKey
  icon: LucideIcon
}[] = [
  { id: "account", nameKey: "account", icon: Settings },
  { id: "profile", nameKey: "profile", icon: User },
  { id: "notifications", nameKey: "notifications", icon: Bell },
  { id: "appearance", nameKey: "appearance", icon: Palette },
  { id: "language", nameKey: "language", icon: Languages },
  { id: "legal", nameKey: "legal", icon: FileText },
]
