import "@/app/globals.css"

import { Nunito_Sans } from "next/font/google"

import { cn } from "@/lib/utils"
import { CookieConsentBanner } from "@/components/cookies/cookie-consent-banner.client"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClientProviderWrapper } from "@/providers/query-client.provider"
import { ThemeProvider } from "@/providers/theme.provider"

const fontSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "arial"],
  preload: true,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans antialiased", fontSans.variable)}>
      <body>
        <ThemeProvider>
          <QueryClientProviderWrapper>
            <TooltipProvider>
              {children}
              <Toaster position="bottom-right" />
              <CookieConsentBanner />
            </TooltipProvider>
          </QueryClientProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
