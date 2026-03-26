"use client"

import type { SettingsSectionContentProps } from "@/features/settings/types/settings-section-content.types"

import { SettingsAccountSection } from "../settings-account-section/settings-account-section"
import { SettingsAppearanceSection } from "../settings-appearance-section/settings-appearance-section"
import { SettingsLanguageSection } from "../settings-language-section/settings-language-section"
import { SettingsLegalSection } from "../settings-legal-section/settings-legal-section"
import { SettingsNotificationsSection } from "../settings-notifications-section/settings-notifications-section"
import { SettingsProfileSection } from "../settings-profile-section/settings-profile-section"

export function SettingsSectionContent({ section, onOpenChange }: SettingsSectionContentProps) {
  return (
    <>
      {section === "account" && <SettingsAccountSection onOpenChange={onOpenChange} />}
      {section === "profile" && <SettingsProfileSection />}
      {section === "notifications" && <SettingsNotificationsSection />}
      {section === "appearance" && <SettingsAppearanceSection />}
      {section === "legal" && <SettingsLegalSection onOpenChange={onOpenChange} />}
      {section === "language" && <SettingsLanguageSection />}
    </>
  )
}
