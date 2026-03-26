import z from "zod"

export const submitDeactivationFeedbackSchema = z.object({
  reason: z.string().trim().min(10, "Please share at least 10 characters.").max(2000, "Reason is too long."),
})

export type SubmitDeactivationFeedbackInput = z.infer<typeof submitDeactivationFeedbackSchema>
