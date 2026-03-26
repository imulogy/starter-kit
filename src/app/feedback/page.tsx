import { DeactivationFeedbackPage } from "@/features/account-deactivation/components/deactivation-feedback-page.client"

export default function FeedbackPage() {
  return (
    <div className="relative z-10 flex h-dvh min-h-0 w-full max-w-full min-w-0 flex-1 flex-col items-stretch justify-start px-0 py-0 md:h-auto md:min-h-full md:items-center md:justify-center md:px-4 md:py-8">
      <DeactivationFeedbackPage />
    </div>
  )
}
