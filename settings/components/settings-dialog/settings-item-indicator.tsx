"use client"

import { AlertCircle } from "lucide-react"

import type { SettingsItemIndicatorProps } from "@/features/settings/types/settings-item-indicator.types"

/** Yellow indicator for settings nav item when something needs attention (e.g. unverified email). */
export function SettingsItemIndicator({ title }: SettingsItemIndicatorProps) {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white [&>svg]:h-3 [&>svg]:w-3"
      title={title}
      aria-hidden
    >
      <AlertCircle />
    </span>
  )
}
