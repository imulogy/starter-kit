import { z } from "zod"

/** GET /api/profile response shape. Validated with Zod before sending. */
export const ProfileResponseSchema = z.object({
  name: z.string(),
  birthDate: z.string().nullable(),
  sex: z.number().int().nullable(),
  nationality: z.string().nullable(),
  mgOnsetDate: z.string().nullable(),
  mgDiagnosisDate: z.string().nullable(),
  mgAntibodyStatus: z.number().int().nullable(),
  mgStage: z.number().int().nullable(),
  mgVariant: z.number().int().nullable(),
  thymectomyStatus: z.number().int().nullable(),
  thymectomyDate: z.string().nullable(),
  juvenileOnset: z.boolean().nullable(),
  otherDiseases: z.array(z.string()),
})

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>

/** Partial profile update: all fields optional. Used for PATCH /api/profile. */
export const ProfileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  birthDate: z.string().datetime().nullable().optional(),
  sex: z.number().min(0).max(1).optional(),
  nationality: z.string().nullable().optional(),
  mgOnsetDate: z.string().datetime().optional(),
  mgDiagnosisDate: z.string().datetime().optional(),
  mgAntibodyStatus: z.number().min(0).max(23).nullable().optional(),
  mgStage: z.number().min(0).max(9).nullable().optional(),
  mgVariant: z.number().min(0).max(8).nullable().optional(),
  thymectomyStatus: z.number().min(0).max(3).optional(),
  thymectomyDate: z.string().datetime().nullable().optional(),
  otherDiseases: z.array(z.string()).optional(),
})

export type ProfileUpdatePayload = z.infer<typeof ProfileUpdateSchema>
