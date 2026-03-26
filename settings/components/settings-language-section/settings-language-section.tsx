"use client"

import { usePathname, useRouter } from "@/i18n/navigation"
import { Languages } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  localeFlag,
  localeLabels,
  locales as localeOptions,
  type Locale,
} from "@/lib/i18n/config"
import { useMutateUpdatePreferredLocale } from "@/features/settings/hooks/use-mutate-update-preferred-locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsLanguageSection() {
  const t = useTranslations("settings.language")
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const locale = (params?.locale as string) ?? "en"
  const currentLocale: Locale = localeOptions.includes(locale as Locale) ? (locale as Locale) : "en"

  const { mutate: updatePreferredLocale } = useMutateUpdatePreferredLocale()

  const handleLocaleChange = (code: string) => {
    document.cookie = `${LOCALE_COOKIE_NAME}=${code}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`
    updatePreferredLocale(code as Locale)
    router.replace(pathname, { locale: code })
  }

  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Languages className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm leading-none font-semibold text-foreground">{t("languageTitle")}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{t("languageDescription")}</p>
        </div>
      </div>
      <div className="pl-11">
        <Select value={currentLocale} onValueChange={handleLocaleChange}>
          <SelectTrigger className="w-full max-w-xs rounded-xl" aria-label={t("selectLanguage")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {localeOptions.map((code) => (
              <SelectItem key={code} value={code} className="rounded-lg">
                <span className="mr-2" aria-hidden>
                  {localeFlag[code]}
                </span>
                {localeLabels[code]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
