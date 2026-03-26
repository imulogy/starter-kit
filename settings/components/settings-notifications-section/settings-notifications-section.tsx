"use client"

import { Bell, Megaphone, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"

import { useFetchNotificationPreferences } from "@/features/notifications/hooks/use-fetch-notification-preferences"
import { useMutateUpdateNotificationPreferences } from "@/features/notifications/hooks/use-mutate-update-notification-preferences"
import {
  isPushSupported,
  usePushSubscribe,
  usePushSubscribed,
  usePushUnsubscribe,
} from "@/features/push/hooks/use-push-subscription"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useIsMobile } from "@/hooks/use-mobile"

import { SettingsNotificationSubsection } from "./settings-notification-subsection"
import { SettingsNotificationsSectionSkeleton } from "./settings-notifications-section-skeleton"

export function SettingsNotificationsSection() {
  const t = useTranslations("settings.notifications")
  const isMobile = useIsMobile()
  const pushSubscribed = usePushSubscribed()
  const pushSubscribe = usePushSubscribe()
  const pushUnsubscribe = usePushUnsubscribe()
  const preferencesQuery = useFetchNotificationPreferences()
  const preferencesLoading = preferencesQuery.isLoading
  const updatePreferences = useMutateUpdateNotificationPreferences()
  const prefs = preferencesQuery.data
  const personalizedEnabled = prefs ? prefs.notificationsEmailPersonalized : true
  const marketingEnabled = prefs ? prefs.notificationsEmailMarketing : false

  const isDisabled = preferencesLoading || updatePreferences.isPending
  const showBrowserNotifications = isPushSupported() && !isMobile

  if (preferencesLoading) {
    return <SettingsNotificationsSectionSkeleton />
  }

  const pushEnabled = pushSubscribed.data?.subscribed ?? false
  const pushLoading = pushSubscribed.isLoading || pushSubscribe.isPending || pushUnsubscribe.isPending
  const pushError = pushSubscribe.error ?? pushUnsubscribe.error

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsNotificationSubsection
        icon={Bell}
        title={t("careRemindersTitle")}
        description={t("careRemindersDescription")}
        toggle={
          <Switch
            checked={personalizedEnabled}
            disabled={isDisabled}
            onCheckedChange={(checked) =>
              updatePreferences.mutate({
                notificationsEmailPersonalized: checked,
              })
            }
          />
        }
      />

      <Separator />

      <SettingsNotificationSubsection
        icon={Megaphone}
        title={t("marketingTitle")}
        description={t("marketingDescription")}
        toggle={
          <Switch
            checked={marketingEnabled}
            disabled={isDisabled}
            onCheckedChange={(checked) => updatePreferences.mutate({ notificationsEmailMarketing: checked })}
          />
        }
      />

      {showBrowserNotifications && (
        <>
          <Separator />
          <SettingsNotificationSubsection
            icon={Smartphone}
            title={t("browserTitle")}
            description={t("browserDescription")}
            toggle={
              <Switch
                checked={pushEnabled}
                disabled={pushLoading}
                onCheckedChange={(checked) => {
                  if (checked) pushSubscribe.mutate()
                  else pushUnsubscribe.mutate()
                }}
              />
            }
          >
            {(pushSubscribe.isError || pushUnsubscribe.isError) && (
              <p className="text-xs text-destructive">
                {pushError instanceof Error ? pushError.message : t("pushError")}
              </p>
            )}
          </SettingsNotificationSubsection>
        </>
      )}
    </div>
  )
}
