"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { SettingsProfileDatePickerFieldProps } from "@/features/settings/types/settings-profile-date-picker-field.types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function SettingsProfileDatePickerField({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
}: SettingsProfileDatePickerFieldProps) {
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  const defaultMin = new Date(today.getFullYear() - 100, 0, 1)
  const defaultMax = today

  const min = minDate ?? defaultMin
  const max = maxDate ?? defaultMax

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start rounded-xl font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={onChange}
          disabled={(date) => date > max || date < min}
          defaultMonth={value ?? undefined}
          captionLayout="dropdown"
          startMonth={min}
          endMonth={max}
          className="rounded-xl border"
        />
      </PopoverContent>
    </Popover>
  )
}
