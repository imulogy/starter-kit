"use client"

import { CheckCircle2, Mail, ShieldAlert, UserX } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/web.routes"
import type { SettingsAccountSessionUser } from "@/features/settings/types/settings-account-section.types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import { SettingsAccountSectionLayout } from "./settings-account-section-layout"

export function SettingsAccountSection() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user as SettingsAccountSessionUser | undefined
  const isEmailVerified = user?.emailVerified === true
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)

  const handleConfirmDeactivate = () => {
    setIsDeactivateDialogOpen(false)
    router.push(WebRoutes.feedback.path)
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsAccountSectionLayout
        icon={Mail}
        title="Email address"
        description="Your account email used for sign-in and notifications."
        hasWarning={!isEmailVerified}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{user?.email ?? "No email found"}</span>
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Email verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                <ShieldAlert className="h-3 w-3" />
                Email not verified
              </span>
            )}
          </div>
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout
        icon={UserX}
        title="Deactivate account"
        description="If you deactivate your account, your personal identifiers and records will be retained for 30 days and then permanently removed from our active systems. This action is final and ensures your data is no longer stored or processed by Imulogy, except where retention is required by law."
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setIsDeactivateDialogOpen(true)}
        >
          <UserX className="mr-2 h-3.5 w-3.5" />
          Deactivate account
        </Button>
        <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate account?</DialogTitle>
              <DialogDescription>
                You will be asked to submit a feedback form first. Your account will only be deactivated after feedback
                is submitted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeactivateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleConfirmDeactivate}>
                Yes, deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SettingsAccountSectionLayout>
    </div>
  )
}
