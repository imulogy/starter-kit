import { betterAuth, User } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { nextCookies } from "better-auth/next-js"

import { MIN_PASSWORD_LENGTH } from "@/lib/auth/auth.schema"
import { prisma } from "@/lib/prisma"
import { sendEmailVerificationEmail, sendResetPasswordEmail, sendWelcomeEmail } from "@/lib/resend/actions"
import { WebRoutes } from "@/lib/web.routes"

const SevenDays = 60 * 60 * 24 * 7

export const auth = betterAuth({
  plugins: [nextCookies()],
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    requireEmailVerification: false,
    enabled: true,
    autoSignIn: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    sendResetPassword: async ({ user, url }: { user: User; url: string }) =>
      await sendResetPasswordEmail({
        to: user.email,
        userFirstname: user.name ?? "Dear User",
        resetPasswordLink: url,
      }),
  },
  resetPassword: {
    enabled: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const callbackURL = encodeURIComponent(`${WebRoutes.root.withBaseUrl()}?emailVerified=1`)
      const verifyUrl = `${WebRoutes.root.withBaseUrl()}/api/auth/verify-email?token=${token}&callbackURL=${callbackURL}`

      await sendEmailVerificationEmail({
        to: user.email,
        subject: "Verify your email address",
        url: verifyUrl,
        firstName: user.name ?? "User",
      })
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  expiresIn: SevenDays,
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const body = ctx.body as { email?: string } | undefined
      const email = typeof body?.email === "string" ? body.email : undefined

      if (!email) return

      const user = await prisma.user.findUnique({
        where: { email },
        select: { deactivatedAt: true },
      })

      if (!user?.deactivatedAt) return

      if (ctx.path === "/sign-in/email") {
        throw new APIError("FORBIDDEN", {
          message: "Account is deactivated",
          code: "ACCOUNT_DEACTIVATED",
        })
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await sendWelcomeEmail({
              to: user.email,
              firstName: user.name ?? undefined,
            })
          } catch (err) {
            console.error("Welcome email failed:", err)
          }
        },
      },
    },
  },
})
