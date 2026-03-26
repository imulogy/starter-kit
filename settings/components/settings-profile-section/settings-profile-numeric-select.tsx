"use client"

import type { SettingsProfileNumericSelectProps } from "@/features/settings/types/settings-profile-numeric-select.types"
import { settingsProfileToSelectValue } from "@/features/settings/utils/settings-profile-form.utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsProfileNumericSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select",
}: SettingsProfileNumericSelectProps) {
  return (
    <Select
      value={settingsProfileToSelectValue(value)}
      onValueChange={(v) => onValueChange(v === "" ? null : Number.parseInt(v, 10))}
    >
      <SelectTrigger className="w-full rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((label, index) => (
          <SelectItem key={label} value={index.toString()}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
