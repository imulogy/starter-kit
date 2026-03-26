"use client"

import { useTranslations } from "next-intl"

import { useProfile } from "@/features/settings/hooks/use-profile"
import { settingsProfileApiToForm } from "@/features/settings/utils/settings-profile-form.utils"

import { SettingsProfileForm } from "./settings-profile-form"

export function SettingsProfileSection() {
  const t = useTranslations("settings.profile")
  const { data: profile, isLoading, dataUpdatedAt } = useProfile()

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">{t("loadingProfile")}</div>
    )
  }

  return <SettingsProfileForm key={dataUpdatedAt} initialValues={settingsProfileApiToForm(profile)} />
}
