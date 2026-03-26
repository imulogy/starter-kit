export type SettingsAccountSessionUser = {
  emailVerified?: boolean
  email?: string | null
  onboardingCompletedAt?: string | Date | null
  onboardingSkippedAt?: string | Date | null
}

export type SettingsAccountSectionProps = {
  onOpenChange: (open: boolean) => void
}
