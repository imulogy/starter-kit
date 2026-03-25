import "server-only"

import { z } from "zod"

import { sendMail } from "@/lib/resend/resend"
import { ResetPasswordEmailTemplate } from "@/lib/resend/templates/reset-password.template"

export const sendResetPasswordEmailSchema = z.object({
  userFirstname: z.string().trim().min(1, "userFirstname is required"),
  to: z.email("to must be a valid email"),
  resetPasswordLink: z.url("resetPasswordLink must be a valid URL"),
})

type SendResetPasswordEmailProps = z.infer<typeof sendResetPasswordEmailSchema>

export async function sendResetPasswordEmail(props: SendResetPasswordEmailProps) {
  const parsed = sendResetPasswordEmailSchema.safeParse(props)

  if (!parsed.success) {
    throw new Error(`Invalid sendResetPasswordEmail props: ${parsed.error.message}`)
  }

  const { userFirstname, to, resetPasswordLink } = parsed.data

  await sendMail({
    to,
    subject: "Reset your password",
    react: ResetPasswordEmailTemplate({ userFirstname, resetPasswordLink }),
  })
}
