"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"

import type { SettingsLegalItemProps } from "@/features/settings/types/settings-legal-section.types"

export function SettingsLegalItem({ href, label, description, onNavigate }: SettingsLegalItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-start justify-between gap-4 rounded-lg px-1 py-1 transition-colors hover:bg-muted"
    >
      <div className="space-y-0.5">
        <p className="text-sm leading-none font-medium text-foreground">{label}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}
