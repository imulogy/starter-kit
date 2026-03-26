import { getCountryDataList } from "countries-list"

import type { ProfileResponse, ProfileUpdatePayload } from "@/features/settings/schemas/profile.schema"
import type { SettingsProfileFormValues } from "@/features/settings/types/settings-profile-form.types"

export const settingsProfileCountryList = getCountryDataList().sort((a, b) => a.name.localeCompare(b.name))

/** Safely coerce number | null | undefined → number | null, preserving 0. */
export function settingsProfileNumOrNull(n: number | null | undefined): number | null {
  return n ?? null
}

/** Convert a number value to a Select string value, preserving 0. */
export function settingsProfileToSelectValue(v: number | null | undefined): string {
  return v !== null && v !== undefined ? String(v) : ""
}

export function settingsProfileApiToForm(data: ProfileResponse): SettingsProfileFormValues {
  return {
    name: data.name,
    birthDate: data.birthDate ? new Date(data.birthDate) : null,
    sex: settingsProfileNumOrNull(data.sex),
    nationality: data.nationality ?? null,
    mgOnsetDate: data.mgOnsetDate ? new Date(data.mgOnsetDate) : null,
    mgDiagnosisDate: data.mgDiagnosisDate ? new Date(data.mgDiagnosisDate) : null,
    mgAntibodyStatus: settingsProfileNumOrNull(data.mgAntibodyStatus),
    mgStage: settingsProfileNumOrNull(data.mgStage),
    mgVariant: settingsProfileNumOrNull(data.mgVariant),
    thymectomyStatus: settingsProfileNumOrNull(data.thymectomyStatus),
    thymectomyDate: data.thymectomyDate ? new Date(data.thymectomyDate) : null,
    otherDiseases: data.otherDiseases?.length ? data.otherDiseases : [""],
  }
}

export function settingsProfileFormToPayload(values: SettingsProfileFormValues): ProfileUpdatePayload {
  return {
    name: values.name,
    birthDate: values.birthDate ? values.birthDate.toISOString() : null,
    sex: values.sex ?? undefined,
    nationality: values.nationality ?? undefined,
    mgOnsetDate: values.mgOnsetDate?.toISOString(),
    mgDiagnosisDate: values.mgDiagnosisDate?.toISOString(),
    mgAntibodyStatus: values.mgAntibodyStatus ?? undefined,
    mgStage: values.mgStage ?? undefined,
    mgVariant: values.mgVariant ?? undefined,
    thymectomyStatus: values.thymectomyStatus ?? undefined,
    thymectomyDate: values.thymectomyDate ? values.thymectomyDate.toISOString() : null,
    otherDiseases: values.otherDiseases.map((s) => s.trim()).filter(Boolean),
  }
}
