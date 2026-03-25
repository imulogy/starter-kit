import { Geist, Geist_Mono } from "next/font/google"

import "@/app/globals.css"

import { cn } from "@/lib/utils"
import { CookieConsentBanner } from "@/components/cookies/cookie-consent-banner.client"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClientProviderWrapper } from "@/providers/query-client.provider"
import { ThemeProvider } from "@/providers/theme.provider"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
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
