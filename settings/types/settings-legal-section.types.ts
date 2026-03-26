import { WebRoutes } from "@/lib/config/web-routes"

export type SettingsLegalSectionProps = {
  onOpenChange?: (open: boolean) => void
}

export type SettingsLegalItemHref = (typeof WebRoutes)["legal"]["privacy"] | (typeof WebRoutes)["legal"]["terms"]

export type SettingsLegalItemProps = {
  href: SettingsLegalItemHref
  label: string
  description: string
  onNavigate?: () => void
}
