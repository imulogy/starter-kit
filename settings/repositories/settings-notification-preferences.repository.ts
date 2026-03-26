import "server-only"

import { prisma } from "@/lib/prisma"
import type { SettingsNotificationPreferencesRow } from "@/features/settings/types/settings-notification-preferences.types"

export async function getNotificationPreferencesByUserId(
  userId: string
): Promise<SettingsNotificationPreferencesRow | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      notificationsEmailPersonalized: true,
      notificationsEmailMarketing: true,
    },
  })

  return user
}

export async function updateNotificationPreferencesByUserId(
  userId: string,
  updates: Partial<
    Pick<SettingsNotificationPreferencesRow, "notificationsEmailPersonalized" | "notificationsEmailMarketing">
  >
): Promise<SettingsNotificationPreferencesRow> {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: {
      notificationsEmailPersonalized: true,
      notificationsEmailMarketing: true,
    },
  })

  return updated
}
