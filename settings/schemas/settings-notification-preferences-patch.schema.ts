import { z } from "zod"

export const settingsNotificationPreferencesPatchSchema = z
  .object({
    notificationsEmailPersonalized: z.boolean().optional(),
    notificationsEmailMarketing: z.boolean().optional(),
  })
  .strict()

export type SettingsNotificationPreferencesPatch = z.infer<typeof settingsNotificationPreferencesPatchSchema>
