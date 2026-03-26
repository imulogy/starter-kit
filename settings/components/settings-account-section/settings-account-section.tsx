"use client"

import { CheckCircle2, ClipboardList, Mail, ShieldCheck, UserX } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { ApiError } from "@/lib/api"
import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/config/web-routes"
import { defaultLocale, isValidLocale } from "@/lib/i18n/config"
import { useDeactivateAccount } from "@/features/auth/hooks/use-deactivate-account"
import { useSendVerificationEmail } from "@/features/auth/hooks/use-send-verification-email"
import type {
  SettingsAccountSectionProps,
  SettingsAccountSessionUser,
} from "@/features/settings/types/settings-account-section.types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { SettingsAccountSectionLayout } from "./settings-account-section-layout"

export function SettingsAccountSection({ onOpenChange }: SettingsAccountSectionProps) {
  const router = useRouter()
  const params = useParams()
  const localeParam = params?.locale as string | undefined
  const locale = localeParam && isValidLocale(localeParam) ? localeParam : defaultLocale
  const t = useTranslations("settings.account")
  const { data: session } = authClient.useSession()
  const deactivate = useDeactivateAccount()
  const sendVerificationMutation = useSendVerificationEmail()

  const user = session?.user as SettingsAccountSessionUser | undefined
  const isEmailVerified = user?.emailVerified === true
  const isOnboardingSkipped = user && !!user.onboardingSkippedAt && !user.onboardingCompletedAt
  const [verifySent, setVerifySent] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  useEffect(() => {
    if (!verifySent || resendTimer <= 0) return

    const timer = setTimeout(() => setResendTimer((prev) => Math.max(0, prev - 1)), 1000)

    return () => clearTimeout(timer)
  }, [verifySent, resendTimer])

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60

    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleDeactivate = () => {
    deactivate.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false)
        void authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push(WebRoutes.withLocale(locale, WebRoutes.home))
            },
          },
        })
      },
    })
  }

  const handleSendVerification = () => {
    if (!user?.email) return
    if (resendTimer > 0 || sendVerificationMutation.isPending) return

    setVerifyError(null)
    sendVerificationMutation.mutate(
      { locale },
      {
        onSuccess: () => {
          setVerifySent(true)
          setResendTimer(60)
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 429) {
            setVerifyError(t("verificationRateLimited"))
          } else {
            setVerifyError(t("verifyError"))
          }
        },
      }
    )
  }

  const deactivateError = deactivate.isError
    ? String(deactivate.error instanceof Error ? deactivate.error.message : deactivate.error)
    : null

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsAccountSectionLayout
        icon={Mail}
        title={t("emailTitle")}
        description={t("emailDescription")}
        hasWarning={!isEmailVerified}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{user?.email ?? "—"}</span>
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                {t("verified")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                {t("unverified")}
              </span>
            )}
          </div>

          {!isEmailVerified && (
            <div className="flex flex-col gap-2">
              {verifySent ? (
                <>
                  <p className="text-sm text-muted-foreground">{t("verificationSent")}</p>
                  <p className="text-sm text-muted-foreground">{t("checkInboxOrSpam")}</p>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={() => void handleSendVerification()}
                    disabled={resendTimer > 0 || sendVerificationMutation.isPending}
                    aria-label={
                      resendTimer > 0
                        ? t("resendVerificationAriaIn", {
                            time: formatTime(resendTimer),
                          })
                        : t("resendVerificationAria")
                    }
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {resendTimer > 0
                      ? t("resendVerificationIn", {
                          time: formatTime(resendTimer),
                        })
                      : t("resendVerification")}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => void handleSendVerification()}
                  disabled={sendVerificationMutation.isPending}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {sendVerificationMutation.isPending ? t("sending") : t("sendVerification")}
                </Button>
              )}
              {verifyError && <p className="text-sm text-destructive">{verifyError}</p>}
            </div>
          )}
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout
        icon={ClipboardList}
        title={t("profileSetupTitle")}
        description={t("profileSetupDescription")}
        hasWarning={isOnboardingSkipped}
      >
        <div className="flex flex-col gap-3">
          {isOnboardingSkipped ? (
            <>
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                {t("incomplete")}
              </span>
              <Button variant="outline" className="w-fit rounded-xl" asChild>
                <Link href={WebRoutes.onboarding} onClick={() => onOpenChange(false)}>
                  {t("completeSetup")}
                </Link>
              </Button>
            </>
          ) : (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3 w-3" />
              {t("complete")}
            </span>
          )}
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout icon={UserX} title={t("deactivateTitle")} description={t("deactivateDescription")}>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeactivateOpen(true)}
            disabled={deactivate.isPending}
          >
            <UserX className="mr-2 h-3.5 w-3.5" />
            {t("deactivateButton")}
          </Button>
          {deactivateError && <p className="text-sm text-destructive">{deactivateError}</p>}
        </div>
      </SettingsAccountSectionLayout>

      <AlertDialog
        open={deactivateOpen}
        onOpenChange={(open) => {
          setDeactivateOpen(open)
          if (!open) deactivate.reset()
        }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>{t("deactivateConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deactivateConfirmDescription")}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deactivate.isPending}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeactivate()
              }}
              disabled={deactivate.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deactivate.isPending ? t("deactivating") : t("deactivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
