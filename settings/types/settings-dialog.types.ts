export type SettingsSectionId = "account" | "profile" | "notifications" | "legal" | "language" | "appearance"

export type SettingsNavNameKey = "account" | "profile" | "notifications" | "legal" | "language" | "appearance"

export type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type SettingsMobileView = "list" | "section"

export type SettingsSessionUser = {
  emailVerified?: boolean
}
