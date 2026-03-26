import type { z } from "zod"

import type { buildSettingsProfileFormSchema } from "@/features/settings/schemas/settings-profile-form.schema"

export type SettingsProfileFormValues = z.infer<ReturnType<typeof buildSettingsProfileFormSchema>>
