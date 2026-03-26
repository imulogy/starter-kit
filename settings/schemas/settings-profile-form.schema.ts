import { z } from "zod"

export function buildSettingsProfileFormSchema(nameRequired: string, diagnosisBeforeOnsetError: string) {
  return z
    .object({
      name: z.string().min(1, nameRequired),
      birthDate: z.date().nullable(),
      sex: z.number().min(0).max(2).nullable(),
      nationality: z.string().nullable(),
      mgOnsetDate: z.date().nullable(),
      mgDiagnosisDate: z.date().nullable(),
      mgAntibodyStatus: z.number().min(0).max(23).nullable(),
      mgStage: z.number().min(0).max(9).nullable(),
      mgVariant: z.number().min(0).max(8).nullable(),
      thymectomyStatus: z.number().min(0).max(3).nullable(),
      thymectomyDate: z.date().nullable(),
      otherDiseases: z.array(z.string()),
    })
    .refine(
      (data) => {
        if (data.mgOnsetDate && data.mgDiagnosisDate) {
          return data.mgDiagnosisDate >= data.mgOnsetDate
        }

        return true
      },
      { message: diagnosisBeforeOnsetError, path: ["mgDiagnosisDate"] }
    )
}
