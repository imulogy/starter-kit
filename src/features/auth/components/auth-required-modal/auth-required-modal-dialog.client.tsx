"use client"

import dynamic from "next/dynamic"

import { SignInForm } from "@/features/auth/components/sign-in/sign-in-form.client"
import { SignUpForm } from "@/features/auth/components/sign-up/sign-up-form.client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"

export type AuthRequiredModalDialogProps = {
  open: boolean
  activeTab: "signin" | "signup"
  onOpenChange: (open: boolean) => void
  onTabChange: (tab: "signin" | "signup") => void
  onSignInSuccess: () => void
  onSignUpSuccess: () => void
}

function AuthRequiredModalDialogComponent({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  onSignInSuccess,
  onSignUpSuccess,
}: AuthRequiredModalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "signin" | "signup")}>
          <TabsContent value="signin" className="mt-0">
            <SignInForm onSuccess={onSignInSuccess} onSwitchToSignUp={() => onTabChange("signup")} />
          </TabsContent>
          <TabsContent value="signup" className="mt-0">
            <SignUpForm onSuccess={onSignUpSuccess} onSwitchToSignIn={() => onTabChange("signin")} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export const AuthRequiredModalDialogLazy = dynamic<AuthRequiredModalDialogProps>(
  () => Promise.resolve(AuthRequiredModalDialogComponent),
  {
    ssr: false,
    loading: () => null,
  }
)
