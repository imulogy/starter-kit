"use client"

import { useMutation } from "@tanstack/react-query"

import { apiRequest } from "@/lib/api"
import { authClient } from "@/lib/auth/auth-client"
import { ApiRoutes } from "@/lib/config/api-routes"
import type { Locale } from "@/lib/i18n/config"

export function useMutateUpdatePreferredLocale() {
  const { refetch: refetchSession } = authClient.useSession()

  return useMutation({
    mutationFn: (locale: Locale) =>
      apiRequest<{ success: boolean }>(ApiRoutes.account.preferredLocale, {
        method: "PATCH",
        body: JSON.stringify({ locale }),
      }),
    onSuccess: () => {
      void refetchSession()
    },
  })
}
