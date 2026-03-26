"use client"

import { MessageSquareWarning } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { submitDeactivationFeedbackAction } from "@/features/account-deactivation/actions/submit-deactivation-feedback.action"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/use-mobile"

const texts = {
  title: "We are sorry to see you go",
  description: "Tell us why you are leaving. Your feedback helps us improve.",
  reasonLabel: "Reason",
  reasonPlaceholder: "Share why you decided to deactivate your account...",
  reasonHint: "Minimum 10 characters.",
  submit: "Submit feedback and sign out",
  validationError: "Please add a longer reason before submitting.",
}

export function DeactivationFeedbackPage() {
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const hasError = searchParams.get("error") === "invalid-feedback"

  const content = (
    <form action={submitDeactivationFeedbackAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="reason">{texts.reasonLabel}</FieldLabel>
          <Textarea
            id="reason"
            name="reason"
            minLength={10}
            maxLength={2000}
            required
            placeholder={texts.reasonPlaceholder}
            className="min-h-32"
          />
          <FieldDescription>{texts.reasonHint}</FieldDescription>
        </Field>
        {hasError ? <p className="text-sm text-destructive">{texts.validationError}</p> : null}
        <Button type="submit" className="w-full">
          {texts.submit}
        </Button>
      </FieldGroup>
    </form>
  )

  if (isMobile) {
    return (
      <Dialog open onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareWarning className="size-5" />
              {texts.title}
            </DialogTitle>
            <DialogDescription>{texts.description}</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border bg-background p-6 shadow-sm">
      <div className="mb-5 space-y-1.5">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <MessageSquareWarning className="size-5" />
          {texts.title}
        </h1>
        <p className="text-sm text-muted-foreground">{texts.description}</p>
      </div>
      {content}
    </div>
  )
}
