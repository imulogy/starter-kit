"use client"

import { useForm } from "@tanstack/react-form"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"

import { requestPasswordResetSchema } from "@/lib/auth/auth.schema"
import { WebRoutes } from "@/lib/config/web-routes"
import { requestPasswordResetAction } from "@/features/auth/actions/request-password-reset.action"
import {
  ACCOUNT_DEACTIVATED,
  ACCOUNT_DEACTIVATED_RESET_PASSWORD_MESSAGE,
  UNKNOWN_ERROR_CODE,
} from "@/features/auth/constants"
import type { RequestPasswordResetFormProps } from "@/features/auth/types/request-password-reset.types"
import { mapRequestPasswordResetError } from "@/features/auth/utils/request-password-reset-form.utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function RequestPasswordResetForm({ serverLocale }: RequestPasswordResetFormProps) {
  const params = useParams()
  const locale = serverLocale ?? (params?.locale as string) ?? "en"
  const t = useTranslations("auth")
  const [isLoading, startTransition] = useTransition()
  const [requestErrorCode, setRequestErrorCode] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)
  const timerStartedRef = useRef(false)

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: requestPasswordResetSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        setRequestErrorCode(null)
        const result = await requestPasswordResetAction({
          email: value.email,
          locale,
        })

        if (result?.ok) {
          setEmailSent(true)
          setResendTimer(60)
        } else if (result && result.ok === false) {
          setRequestErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
        }
      })
    },
  })

  useEffect(() => {
    if (emailSent && !timerStartedRef.current) {
      setResendTimer(60)
      setRequestErrorCode(null)
      timerStartedRef.current = true
    }
    if (!emailSent) timerStartedRef.current = false
  }, [emailSent, resendTimer])

  useEffect(() => {
    if (!emailSent || resendTimer <= 0) return

    const timer = setTimeout(() => {
      setResendTimer((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [emailSent, resendTimer])

  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return

    setResendLoading(true)
    try {
      const result = await requestPasswordResetAction({
        email: form.state.values.email,
        locale,
      })

      if (result?.ok) {
        setResendTimer(60)
      } else if (result && result.ok === false) {
        setRequestErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
      }
    } finally {
      setResendLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const isDeactivated = requestErrorCode === ACCOUNT_DEACTIVATED

  const requestErrorLabel =
    requestErrorCode === null
      ? null
      : (() => {
          const mapped = mapRequestPasswordResetError(requestErrorCode)

          if (mapped.kind === "raw") {
            return mapped.message
          }

          return t(mapped.key)
        })()

  let cardDescription: string | null = null

  if (!isDeactivated) {
    cardDescription = emailSent ? t("emailSentDescription") : t("requestResetDescription")
  }

  return (
    <Card
      className={
        isDeactivated
          ? "flex w-full max-w-full min-w-full flex-col gap-2 rounded-none border-0 py-6 shadow-none sm:rounded-xl sm:border md:max-w-md md:min-w-0 md:flex-initial"
          : "flex h-screen min-h-0 w-full max-w-full min-w-full flex-col justify-center gap-2 rounded-none border-0 shadow-none sm:justify-start sm:rounded-xl sm:border md:h-auto md:max-w-md md:min-w-0 md:flex-initial"
      }
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t("resetPasswordTitle")}</CardTitle>
        {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isDeactivated ? (
          <div className="flex min-h-0 flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">{ACCOUNT_DEACTIVATED_RESET_PASSWORD_MESSAGE}</p>
            <Link
              href={WebRoutes.withLocale(locale, WebRoutes.signIn)}
              className="inline-flex font-medium text-primary underline underline-offset-2"
            >
              {t("signInToReactivate")}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center text-sm">
                {requestErrorLabel && <p className="text-red-500">{requestErrorLabel}</p>}
              </div>
              {!emailSent && (
                <>
                  <form.Field name="email">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>{t("email")}</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              field.handleChange(e.target.value)
                              if (requestErrorCode) setRequestErrorCode(null)
                            }}
                            aria-invalid={isInvalid}
                            placeholder={t("emailPlaceholder")}
                            autoComplete="email"
                            required
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      )
                    }}
                  </form.Field>
                  <Field>
                    <Button type="submit" isLoading={isLoading} disabled={isLoading} aria-label={t("sendResetEmail")}>
                      {t("resetPasswordButton")}
                    </Button>
                  </Field>
                </>
              )}
              {emailSent && (
                <Field>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleResend()}
                    isLoading={resendLoading}
                    disabled={resendTimer > 0 || resendLoading}
                    aria-label={
                      resendTimer > 0 ? t("resendAriaIn", { time: formatTime(resendTimer) }) : t("resendAria")
                    }
                  >
                    {resendTimer > 0 ? t("resendIn", { time: formatTime(resendTimer) }) : t("resendEmail")}
                  </Button>
                </Field>
              )}
              <FieldDescription className="flex items-center justify-center gap-2 text-center text-sm">
                <span>{t("rememberPassword")} </span>
                <Link className="text-xs underline" href={WebRoutes.withLocale(locale, WebRoutes.signIn)}>
                  {t("signIn")}
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
