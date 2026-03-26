import "server-only"

import { prisma } from "@/lib/prisma"
import { getJuvenileOnset } from "@/features/onboarding/schemas/onboarding.schema"
import { ProfileResponseSchema, type ProfileUpdatePayload } from "@/features/settings/schemas/profile.schema"

export async function getProfileByUserId(userId: string) {
  const [user, patientProfile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.patientProfile.findUnique({
      where: { userId },
      select: {
        birthDate: true,
        sex: true,
        nationality: true,
        mgOnsetDate: true,
        mgDiagnosisDate: true,
        mgAntibodyStatus: true,
        mgStage: true,
        mgVariant: true,
        thymectomyStatus: true,
        thymectomyDate: true,
        juvenileOnset: true,
        otherDiseases: true,
      },
    }),
  ])

  if (!user) {
    return null
  }

  const raw = {
    name: user.name ?? "User",
    birthDate: patientProfile?.birthDate?.toISOString() ?? null,
    sex: patientProfile?.sex ?? null,
    nationality: patientProfile?.nationality ?? null,
    mgOnsetDate: patientProfile?.mgOnsetDate?.toISOString() ?? null,
    mgDiagnosisDate: patientProfile?.mgDiagnosisDate?.toISOString() ?? null,
    mgAntibodyStatus: patientProfile?.mgAntibodyStatus ?? null,
    mgStage: patientProfile?.mgStage ?? null,
    mgVariant: patientProfile?.mgVariant ?? null,
    thymectomyStatus: patientProfile?.thymectomyStatus ?? null,
    thymectomyDate: patientProfile?.thymectomyDate?.toISOString() ?? null,
    juvenileOnset: patientProfile?.juvenileOnset ?? null,
    otherDiseases: patientProfile?.otherDiseases ?? [],
  }

  return ProfileResponseSchema.parse(raw)
}

export async function updateProfileByUserId(userId: string, data: ProfileUpdatePayload) {
  if (data.name !== undefined) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    })
  }

  const hasProfileUpdate =
    data.birthDate !== undefined ||
    data.sex !== undefined ||
    data.nationality !== undefined ||
    data.mgOnsetDate !== undefined ||
    data.mgDiagnosisDate !== undefined ||
    data.mgAntibodyStatus !== undefined ||
    data.mgStage !== undefined ||
    data.mgVariant !== undefined ||
    data.thymectomyStatus !== undefined ||
    data.thymectomyDate !== undefined ||
    data.otherDiseases !== undefined

  if (!hasProfileUpdate) {
    return
  }

  const existing = await prisma.patientProfile.findUnique({
    where: { userId },
  })

  let birthDate: Date | null

  if (data.birthDate !== undefined) {
    birthDate = data.birthDate ? new Date(data.birthDate) : null
  } else {
    birthDate = existing?.birthDate ?? null
  }
  const mgOnsetDateStr = data.mgOnsetDate ?? existing?.mgOnsetDate?.toISOString() ?? null
  const mgOnsetDate = mgOnsetDateStr ? new Date(mgOnsetDateStr) : null
  const juvenileOnset =
    birthDate !== null && mgOnsetDate ? getJuvenileOnset(birthDate, mgOnsetDate) : (existing?.juvenileOnset ?? null)

  const mgOnsetDateFinal = data.mgOnsetDate ? new Date(data.mgOnsetDate) : (existing?.mgOnsetDate ?? null)
  const mgDiagnosisDateFinal = data.mgDiagnosisDate
    ? new Date(data.mgDiagnosisDate)
    : (existing?.mgDiagnosisDate ?? null)
  let thymectomyDateFinal: Date | null = existing?.thymectomyDate ?? null

  if (data.thymectomyDate !== undefined) {
    thymectomyDateFinal = data.thymectomyDate ? new Date(data.thymectomyDate) : null
  }

  await prisma.patientProfile.upsert({
    where: { userId },
    create: {
      userId,
      birthDate: birthDate ?? existing?.birthDate ?? null,
      sex: data.sex ?? existing?.sex ?? null,
      nationality: data.nationality ?? existing?.nationality ?? null,
      mgOnsetDate: mgOnsetDateFinal,
      mgDiagnosisDate: mgDiagnosisDateFinal,
      mgAntibodyStatus: data.mgAntibodyStatus ?? existing?.mgAntibodyStatus ?? null,
      mgStage: data.mgStage ?? existing?.mgStage ?? null,
      mgVariant: data.mgVariant ?? existing?.mgVariant ?? null,
      thymectomyStatus: data.thymectomyStatus ?? existing?.thymectomyStatus ?? null,
      thymectomyDate: thymectomyDateFinal,
      juvenileOnset,
      otherDiseases: data.otherDiseases ?? existing?.otherDiseases ?? [],
    },
    update: {
      ...(data.birthDate !== undefined && {
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      }),
      ...(data.sex !== undefined && { sex: data.sex }),
      ...(data.nationality !== undefined && {
        nationality: data.nationality,
      }),
      ...(data.mgOnsetDate !== undefined && {
        mgOnsetDate: new Date(data.mgOnsetDate),
      }),
      ...(data.mgDiagnosisDate !== undefined && {
        mgDiagnosisDate: new Date(data.mgDiagnosisDate),
      }),
      ...(data.mgAntibodyStatus !== undefined && {
        mgAntibodyStatus: data.mgAntibodyStatus,
      }),
      ...(data.mgStage !== undefined && { mgStage: data.mgStage }),
      ...(data.mgVariant !== undefined && { mgVariant: data.mgVariant }),
      ...(data.thymectomyStatus !== undefined && {
        thymectomyStatus: data.thymectomyStatus,
      }),
      ...(data.thymectomyDate !== undefined && {
        thymectomyDate: data.thymectomyDate ? new Date(data.thymectomyDate) : null,
      }),
      ...(data.otherDiseases !== undefined && {
        otherDiseases: data.otherDiseases,
      }),
      juvenileOnset,
    },
  })
}
