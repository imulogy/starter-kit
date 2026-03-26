import "server-only"

import type { Locale } from "@/lib/i18n/config"
import { prisma } from "@/lib/prisma"

export async function updatePreferredLocaleForUser(userId: string, locale: Locale) {
  await prisma.user.update({
    where: { id: userId },
    data: { preferredLocale: locale },
  })
}
