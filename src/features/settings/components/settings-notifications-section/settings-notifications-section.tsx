"use client"

import { Bell, Megaphone } from "lucide-react"
import { useEffect, useState, useTransition } from "react"

import {
  getNotificationPreferencesAction,
} from "@/actions/account/get-notification-preferences.action"
import { updateNotificationPreferencesAction } from "@/actions/account/update-notification-preferences.action"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import { SettingsNotificationSubsection } from "./settings-notification-subsection"

export function SettingsNotificationsSection() {
  const [isPending, startTransition] = useTransition()
  const [notificationsEmailPersonalized, setNotificationsEmailPersonalized] = useState(true)
  const [notificationsEmailMarketing, setNotificationsEmailMarketing] = useState(true)

  useEffect(() => {
    startTransition(async () => {
      const result = await getNotificationPreferencesAction()

      if (!result.ok) {
        return
      }

      setNotificationsEmailPersonalized(result.data.notificationsEmailPersonalized)
      setNotificationsEmailMarketing(result.data.notificationsEmailMarketing)
    })
  }, [])

  const handlePersonalizedChange = (checked: boolean) => {
    const previous = notificationsEmailPersonalized
    setNotificationsEmailPersonalized(checked)

    startTransition(async () => {
      const result = await updateNotificationPreferencesAction({
        notificationsEmailPersonalized: checked,
      })

      if (!result.ok) {
        setNotificationsEmailPersonalized(previous)
      }
    })
  }

  const handleMarketingChange = (checked: boolean) => {
    const previous = notificationsEmailMarketing
    setNotificationsEmailMarketing(checked)

    startTransition(async () => {
      const result = await updateNotificationPreferencesAction({
        notificationsEmailMarketing: checked,
      })

      if (!result.ok) {
        setNotificationsEmailMarketing(previous)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsNotificationSubsection
        icon={Bell}
        title="Personalized emails"
        description="Receive product reminders and service updates by email."
        toggle={
          <Switch checked={notificationsEmailPersonalized} onCheckedChange={handlePersonalizedChange} disabled={isPending} />
        }
      />

      <Separator />

      <SettingsNotificationSubsection
        icon={Megaphone}
        title="Marketing emails"
        description="Receive promotions and feature announcements."
        toggle={<Switch checked={notificationsEmailMarketing} onCheckedChange={handleMarketingChange} disabled={isPending} />}
      />
    </div>
  )
}
