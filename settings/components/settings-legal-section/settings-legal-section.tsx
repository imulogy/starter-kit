"use client"

import { Scale } from "lucide-react"
import { useTranslations } from "next-intl"

import { WebRoutes } from "@/lib/config/web-routes"
import type { SettingsLegalSectionProps } from "@/features/settings/types/settings-legal-section.types"

import { SettingsLegalItem } from "./settings-legal-item"
import { SettingsLegalSectionLayout } from "./settings-legal-section-layout"

export function SettingsLegalSection({ onOpenChange }: SettingsLegalSectionProps) {
  const t = useTranslations("settings.legal")
  const handleNavigate = () => onOpenChange?.(false)

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsLegalSectionLayout icon={Scale} title={t("legalTitle")} description={t("legalDescription")}>
        <div className="space-y-1">
          <SettingsLegalItem
            href={WebRoutes.legal.privacy}
            label={t("privacyLabel")}
            description={t("privacyDescription")}
            onNavigate={handleNavigate}
          />
          <SettingsLegalItem
            href={WebRoutes.legal.terms}
            label={t("termsLabel")}
            description={t("termsDescription")}
            onNavigate={handleNavigate}
          />
        </div>
      </SettingsLegalSectionLayout>
    </div>
  )
}
