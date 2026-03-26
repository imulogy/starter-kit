"use client"

import { useForm } from "@tanstack/react-form"
import type { Route } from "next"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { resetPasswordSchema } from "@/lib/auth/auth.schema"
import { WebRoutes } from "@/lib/config/web-routes"
import { resetPasswordTokenAction } from "@/features/auth/actions/reset-password-token.action"
import { UNKNOWN_ERROR_CODE } from "@/features/auth/constants"
import type { ResetPasswordFormProps } from "@/features/auth/types/reset-password.types"
import { mapResetPasswordError } from "@/features/auth/utils/reset-password-form.utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function ResetPasswordForm({ token, initialError, serverLocale }: ResetPasswordFormProps) {
  const router = useRouter()
  const params = useParams()
  const locale = serverLocale ?? (params?.locale as string) ?? "en"
  const t = useTranslations("auth")
  const [isLoading, startTransition] = useTransition()
  const [resetErrorCode, setResetErrorCode] = useState<string | null>(initialError ?? null)

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        setResetErrorCode(null)
        const result = await resetPasswordTokenAction({
          newPassword: value.newPassword,
          confirmPassword: value.confirmPassword,
          token,
          localeHint: locale,
        })

        if (result.ok) {
          if ("redirectTo" in result && result.redirectTo) {
            router.push(result.redirectTo as Route)
          }
          return
        }

        setResetErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
      })
    },
  })

  const resetErrorLabel =
    resetErrorCode === null
      ? null
      : (() => {
          const mapped = mapResetPasswordError(resetErrorCode)

          return t(mapped.key)
        })()

  return (
    <Card className="flex h-screen min-h-0 w-full max-w-full min-w-full flex-col justify-center gap-2 rounded-none border-0 shadow-none sm:justify-start sm:rounded-xl sm:border md:h-auto md:max-w-md md:min-w-0 md:flex-initial">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t("resetPasswordTitle")}</CardTitle>
        <CardDescription>{t("resetPasswordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <div>{resetErrorLabel && <p className="text-red-500">{resetErrorLabel}</p>}</div>
            <form.Field name="newPassword">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t("newPassword")}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        if (resetErrorCode) setResetErrorCode(null)
                      }}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                      required
                      placeholder={t("newPasswordPlaceholder")}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t("confirmPassword")}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        if (resetErrorCode) setResetErrorCode(null)
                      }}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                      required
                      placeholder={t("confirmPasswordPlaceholder")}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
            <Field>
              <Button type="submit" isLoading={isLoading} disabled={isLoading} aria-label={t("resetPassword")}>
                {t("resetPassword")}
              </Button>
            </Field>
            <FieldDescription className="text-center">
              {t("rememberPassword")}{" "}
              <Link className="text-sm underline" href={WebRoutes.withLocale(locale, WebRoutes.signIn)}>
                {t("signIn")}
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
