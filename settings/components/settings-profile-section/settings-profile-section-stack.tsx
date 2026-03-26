"use client"

import type { SettingsSectionStackProps } from "@/features/settings/types/settings-section-stack.types"

export function SettingsProfileSectionStack({ icon: Icon, title, description, children }: SettingsSectionStackProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="text-sm leading-none font-semibold text-foreground">{title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="w-full pl-0 md:pl-11">{children}</div>
    </section>
  )
}
