"use client"

import { Bell, Megaphone, Smartphone } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import { SettingsNotificationSubsection } from "./settings-notification-subsection"

export function SettingsNotificationsSection() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsNotificationSubsection
        icon={Bell}
        title="Care reminders"
        description="Receive product reminders and service updates by email."
        toggle={<Switch checked />}
      />

      <Separator />

      <SettingsNotificationSubsection
        icon={Megaphone}
        title="Marketing updates"
        description="Receive promotions and feature announcements."
        toggle={<Switch />}
      />

      <Separator />

      <SettingsNotificationSubsection
        icon={Smartphone}
        title="Browser notifications"
        description="Enable in-browser alerts on this device."
        toggle={<Switch />}
      />
    </div>
  )
}
