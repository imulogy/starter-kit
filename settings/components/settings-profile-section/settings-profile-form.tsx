"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, ClipboardList, HeartPulse, Plus, Stethoscope, Trash2, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  MG_ANTIBODY_LABEL_TO_KEY,
  MG_STAGE_LABEL_TO_KEY,
  MG_VARIANT_LABEL_TO_KEY,
} from "@/features/onboarding/constants/onboarding-option-keys"
import {
  MgAntibodyOptionKeysOrdered,
  MgStageOptionKeysOrdered,
  MgVariantOptionKeysOrdered,
  SexOptionKeys,
} from "@/features/onboarding/constants/onboarding-options"
import {
  SETTINGS_PROFILE_MAX_AGE,
  SETTINGS_PROFILE_MIN_AGE,
} from "@/features/settings/constants/settings-profile-form.constants"
import { useUpdateProfile } from "@/features/settings/hooks/use-profile"
import { buildSettingsProfileFormSchema } from "@/features/settings/schemas/settings-profile-form.schema"
import type { SettingsProfileFormProps } from "@/features/settings/types/settings-profile-form-props.types"
import type { SettingsProfileFormValues } from "@/features/settings/types/settings-profile-form.types"
import {
  settingsProfileCountryList,
  settingsProfileFormToPayload,
} from "@/features/settings/utils/settings-profile-form.utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

import { SettingsProfileDatePickerField } from "./settings-profile-date-picker-field"
import { SettingsProfileNumericSelect } from "./settings-profile-numeric-select"
import { SettingsProfileSectionStack } from "./settings-profile-section-stack"

export function SettingsProfileForm({ initialValues }: SettingsProfileFormProps) {
  const t = useTranslations("settings.profile")
  const tOpt = useTranslations("options")
  const [nationalityOpen, setNationalityOpen] = useState(false)
  const [mgAntibodyOpen, setMgAntibodyOpen] = useState(false)
  const [mgStageOpen, setMgStageOpen] = useState(false)
  const [mgVariantOpen, setMgVariantOpen] = useState(false)
  const updateProfile = useUpdateProfile()

  const profileFormSchema = useMemo(
    () => buildSettingsProfileFormSchema(t("nameRequired"), t("diagnosisBeforeOnsetError")),
    [t]
  )

  const form = useForm<SettingsProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues,
  })

  const thymectomyStatus = useWatch({
    control: form.control,
    name: "thymectomyStatus",
  })
  const otherDiseaseRows = useWatch({
    control: form.control,
    name: "otherDiseases",
  })
  const showThymectomyDate = thymectomyStatus === 1

  const onSubmit = (values: SettingsProfileFormValues) => {
    updateProfile.mutate(settingsProfileFormToPayload(values), {
      onSuccess: () => toast.success(t("profileUpdated")),
      onError: () => toast.error(t("profileUpdateFailed")),
    })
  }

  const sexLabels: Record<string, string> = {
    male: t("male"),
    female: t("female"),
    intersex: t("intersex"),
  }

  return (
    <div className="flex w-full flex-col">
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="flex flex-col">
          <div className="h-[calc(100dvh-3.5rem)] overflow-x-hidden overflow-y-auto md:h-[calc(700px-3.5rem)]">
            <div className="flex flex-col gap-6 p-4 pb-20 sm:pb-10">
              <SettingsProfileSectionStack
                icon={User}
                title={t("basicInfoTitle")}
                description={t("basicInfoDescription")}
              >
                <div className="grid grid-cols-1 gap-4 *:min-w-0 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fullName")}</FormLabel>
                        <Input {...field} className="w-full rounded-xl" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => {
                      const today = new Date()
                      const minBirthDate = new Date(today.getFullYear() - SETTINGS_PROFILE_MAX_AGE, 0, 1)
                      const maxBirthDate = new Date(today.getFullYear() - SETTINGS_PROFILE_MIN_AGE, 11, 31)

                      return (
                        <FormItem>
                          <FormLabel>{t("birthDate")}</FormLabel>
                          <SettingsProfileDatePickerField
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("selectBirthDate")}
                            minDate={minBirthDate}
                            maxDate={maxBirthDate}
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("sex")}</FormLabel>
                        <SettingsProfileNumericSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          options={SexOptionKeys.map((k) => sexLabels[k] ?? k)}
                          placeholder={t("select")}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => {
                      const selected = settingsProfileCountryList.find((c) => c.iso2 === field.value) ?? null

                      return (
                        <FormItem>
                          <FormLabel>{t("nationality")}</FormLabel>
                          <Popover modal open={nationalityOpen} onOpenChange={setNationalityOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between rounded-xl font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {selected ? selected.name : t("selectNationality")}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-(--radix-popover-trigger-width) rounded-xl p-0" align="start">
                              <Command
                                filter={(value, search) => {
                                  const name = settingsProfileCountryList.find((c) => c.iso2 === value)?.name ?? ""

                                  return name.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
                                }}
                              >
                                <CommandInput placeholder={t("searchPlaceholder")} />
                                <CommandList>
                                  <CommandEmpty>{t("noCountryFound")}</CommandEmpty>
                                  <CommandGroup>
                                    {settingsProfileCountryList.map((c) => (
                                      <CommandItem
                                        key={c.iso2}
                                        value={c.iso2}
                                        onSelect={() => {
                                          field.onChange(field.value === c.iso2 ? null : c.iso2)
                                          setNationalityOpen(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === c.iso2 ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {c.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </div>
              </SettingsProfileSectionStack>

              <Separator />

              <SettingsProfileSectionStack
                icon={Stethoscope}
                title={t("mgHistoryTitle")}
                description={t("mgHistoryDescription")}
              >
                <div className="grid grid-cols-1 gap-4 *:min-w-0 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="mgOnsetDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("mgOnset")}</FormLabel>
                        <SettingsProfileDatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("pickDate")}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mgDiagnosisDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("mgDiagnosisDate")}</FormLabel>
                        <SettingsProfileDatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("pickDate")}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </SettingsProfileSectionStack>

              <Separator />

              <SettingsProfileSectionStack
                icon={HeartPulse}
                title={t("diseaseTreatmentTitle")}
                description={t("diseaseTreatmentDescription")}
              >
                <div className="grid grid-cols-1 gap-4 *:min-w-0 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="mgAntibodyStatus"
                    render={({ field }) => {
                      const value = field.value !== null && field.value !== undefined ? Number(field.value) : null
                      const selected =
                        value !== null ? MgAntibodyOptionKeysOrdered.find((o) => o.value === value) : null

                      return (
                        <FormItem>
                          <FormLabel>{t("mgAntibodyStatus")}</FormLabel>
                          <Popover modal open={mgAntibodyOpen} onOpenChange={setMgAntibodyOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={mgAntibodyOpen}
                                className={cn(
                                  "w-full justify-between gap-2 rounded-xl font-normal",
                                  (field.value === null || field.value === undefined) && "text-muted-foreground"
                                )}
                              >
                                <span
                                  className="min-w-0 truncate"
                                  title={
                                    selected
                                      ? tOpt(`mgAntibody.${MG_ANTIBODY_LABEL_TO_KEY[selected.label]}`)
                                      : undefined
                                  }
                                >
                                  {selected
                                    ? tOpt(`mgAntibody.${MG_ANTIBODY_LABEL_TO_KEY[selected.label]}`)
                                    : t("select")}
                                </span>
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <Command
                                filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
                              >
                                <CommandInput placeholder={t("searchAntibody")} />
                                <CommandList>
                                  <CommandEmpty>{t("noOptionFound")}</CommandEmpty>
                                  <CommandGroup>
                                    {MgAntibodyOptionKeysOrdered.map(({ label, value }) => {
                                      const key = MG_ANTIBODY_LABEL_TO_KEY[label]
                                      const translated = tOpt(`mgAntibody.${key}`)

                                      return (
                                        <CommandItem
                                          key={value}
                                          value={translated}
                                          className="min-w-0 wrap-break-word"
                                          onSelect={() => {
                                            field.onChange(field.value === value ? null : value)
                                            setMgAntibodyOpen(false)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              value === field.value ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {translated}
                                        </CommandItem>
                                      )
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="mgStage"
                    render={({ field }) => {
                      const value = field.value !== null && field.value !== undefined ? Number(field.value) : null
                      const selected = value !== null ? MgStageOptionKeysOrdered.find((o) => o.value === value) : null

                      return (
                        <FormItem>
                          <FormLabel>{t("mgStage")}</FormLabel>
                          <Popover modal open={mgStageOpen} onOpenChange={setMgStageOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={mgStageOpen}
                                className={cn(
                                  "w-full justify-between gap-2 rounded-xl font-normal",
                                  (field.value === null || field.value === undefined) && "text-muted-foreground"
                                )}
                              >
                                <span
                                  className="min-w-0 truncate"
                                  title={
                                    selected ? tOpt(`mgStage.${MG_STAGE_LABEL_TO_KEY[selected.label]}`) : undefined
                                  }
                                >
                                  {selected ? tOpt(`mgStage.${MG_STAGE_LABEL_TO_KEY[selected.label]}`) : t("select")}
                                </span>
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <Command
                                filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
                              >
                                <CommandInput placeholder={t("searchStage")} />
                                <CommandList>
                                  <CommandEmpty>{t("noOptionFound")}</CommandEmpty>
                                  <CommandGroup>
                                    {MgStageOptionKeysOrdered.map(({ label, value }) => {
                                      const key = MG_STAGE_LABEL_TO_KEY[label]
                                      const translated = tOpt(`mgStage.${key}`)

                                      return (
                                        <CommandItem
                                          key={value}
                                          value={translated}
                                          className="min-w-0 wrap-break-word"
                                          onSelect={() => {
                                            field.onChange(field.value === value ? null : value)
                                            setMgStageOpen(false)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              value === field.value ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {translated}
                                        </CommandItem>
                                      )
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="mgVariant"
                    render={({ field }) => {
                      const value = field.value !== null && field.value !== undefined ? Number(field.value) : null
                      const selected = value !== null ? MgVariantOptionKeysOrdered.find((o) => o.value === value) : null

                      return (
                        <FormItem>
                          <FormLabel>{t("mgVariant")}</FormLabel>
                          <Popover modal open={mgVariantOpen} onOpenChange={setMgVariantOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={mgVariantOpen}
                                className={cn(
                                  "w-full justify-between gap-2 rounded-xl font-normal",
                                  (field.value === null || field.value === undefined) && "text-muted-foreground"
                                )}
                              >
                                <span
                                  className="min-w-0 truncate"
                                  title={
                                    selected ? tOpt(`mgVariant.${MG_VARIANT_LABEL_TO_KEY[selected.label]}`) : undefined
                                  }
                                >
                                  {selected
                                    ? tOpt(`mgVariant.${MG_VARIANT_LABEL_TO_KEY[selected.label]}`)
                                    : t("select")}
                                </span>
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <Command
                                filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
                              >
                                <CommandInput placeholder={t("searchVariant")} />
                                <CommandList>
                                  <CommandEmpty>{t("noOptionFound")}</CommandEmpty>
                                  <CommandGroup>
                                    {MgVariantOptionKeysOrdered.map(({ label, value }) => {
                                      const key = MG_VARIANT_LABEL_TO_KEY[label]
                                      const translated = tOpt(`mgVariant.${key}`)

                                      return (
                                        <CommandItem
                                          key={value}
                                          value={translated}
                                          className="min-w-0 wrap-break-word"
                                          onSelect={() => {
                                            field.onChange(field.value === value ? null : value)
                                            setMgVariantOpen(false)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              value === field.value ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {translated}
                                        </CommandItem>
                                      )
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="thymectomyStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("thymectomy")}</FormLabel>
                        <SettingsProfileNumericSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          options={[
                            t("thymectomyNo"),
                            t("thymectomyYes"),
                            t("thymectomyPlanned"),
                            t("thymectomyUnknown"),
                          ]}
                          placeholder={t("select")}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showThymectomyDate ? (
                    <FormField
                      control={form.control}
                      name="thymectomyDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("thymectomyDate")}</FormLabel>
                          <SettingsProfileDatePickerField
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("pickDate")}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div />
                  )}
                </div>
              </SettingsProfileSectionStack>

              <Separator />

              <SettingsProfileSectionStack
                icon={ClipboardList}
                title={t("otherDiseasesTitle")}
                description={t("otherDiseasesDescription")}
              >
                <div className="flex flex-col gap-3">
                  {(otherDiseaseRows ?? []).map((_, index) => (
                    <FormField
                      key={`other-disease-${index}`}
                      control={form.control}
                      name={`otherDiseases.${index}`}
                      render={({ field: f }) => (
                        <FormItem>
                          <div className="flex w-full gap-2">
                            <Input
                              placeholder={t("otherDiseasesPlaceholder")}
                              className="min-w-0 flex-1 rounded-xl"
                              value={typeof f.value === "string" ? f.value : ""}
                              onChange={(e) => f.onChange(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0 rounded-xl"
                              onClick={() => {
                                const current = form.getValues("otherDiseases")
                                form.setValue(
                                  "otherDiseases",
                                  current.filter((__, i) => i !== index),
                                  { shouldDirty: true }
                                )
                              }}
                              aria-label={t("removeCondition")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="default"
                    className="w-full rounded-xl border border-input"
                    onClick={() => {
                      const current = form.getValues("otherDiseases")
                      form.setValue("otherDiseases", [...current, ""], {
                        shouldDirty: true,
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("addAnother")}
                  </Button>
                </div>
              </SettingsProfileSectionStack>
            </div>

            <footer className="sticky bottom-0 z-10 flex shrink-0 justify-end border-t border-border bg-background px-4 py-3">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || updateProfile.isPending}
                className="w-fit rounded-xl"
              >
                {updateProfile.isPending ? t("saving") : t("saveProfile")}
              </Button>
            </footer>
          </div>
        </form>
      </Form>
    </div>
  )
}
