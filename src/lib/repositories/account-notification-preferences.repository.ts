import "server-only"

import { prisma } from "@/lib/prisma"
import {
  notificationPreferencesSchema,
  type NotificationPreferences,
  type UpdateNotificationPreferencesInput,
} from "@/features/settings/schemas/notification-preferences.schema"

export async function getAccountNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
  const rows = await prisma.$queryRaw<Array<{ notificationsEmailMarketing: boolean; notificationsEmailPersonalized: boolean }>>`
    SELECT
      "notificationsEmailMarketing",
      "notificationsEmailPersonalized"
    FROM "user"
    WHERE "id" = ${userId}
    LIMIT 1
  `

  const row = rows[0]

  if (!row) {
    return null
  }

  const parsed = notificationPreferencesSchema.safeParse(row)
  if (!parsed.success) {
    return null
  }

  return parsed.data
}

export async function updateAccountNotificationPreferences(
  userId: string,
  values: UpdateNotificationPreferencesInput
): Promise<NotificationPreferences | null> {
  const updateData: string[] = []
  const queryValues: Array<boolean | string> = []

  if (typeof values.notificationsEmailMarketing === "boolean") {
    updateData.push(`"notificationsEmailMarketing" = $${queryValues.length + 1}`)
    queryValues.push(values.notificationsEmailMarketing)
  }

  if (typeof values.notificationsEmailPersonalized === "boolean") {
    updateData.push(`"notificationsEmailPersonalized" = $${queryValues.length + 1}`)
    queryValues.push(values.notificationsEmailPersonalized)
  }

  if (updateData.length === 0) {
    return getAccountNotificationPreferences(userId)
  }

  queryValues.push(userId)

  const rows = await prisma.$queryRawUnsafe<Array<{ notificationsEmailMarketing: boolean; notificationsEmailPersonalized: boolean }>>(
    `
      UPDATE "user"
      SET ${updateData.join(", ")}
      WHERE "id" = $${queryValues.length}
      RETURNING "notificationsEmailMarketing", "notificationsEmailPersonalized"
    `,
    ...queryValues
  )

  const row = rows[0]
  if (!row) {
    return null
  }

  const parsed = notificationPreferencesSchema.safeParse(row)
  if (!parsed.success) {
    return null
  }

  return parsed.data
}
