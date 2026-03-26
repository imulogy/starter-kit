export type SettingsSectionId = "account" | "notifications" | "appearance" | "legal"

export type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type SettingsMobileView = "list" | "section"
