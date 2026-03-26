import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiRequest } from "@/lib/api"
import { authClient } from "@/lib/auth/auth-client"
import { ApiRoutes } from "@/lib/config/api-routes"
import type { ProfileResponse, ProfileUpdatePayload } from "@/features/settings/schemas/profile.schema"

export const PROFILE_QUERY_KEY = ["profile"]

export function useProfile() {
  const { data: session } = authClient.useSession()

  return useQuery<ProfileResponse>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => apiRequest<ProfileResponse>(ApiRoutes.profile, { method: "GET" }),
    enabled: !!session?.user,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProfileUpdatePayload) => {
      await apiRequest<{ success: boolean }>(ApiRoutes.profile, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
  })
}
