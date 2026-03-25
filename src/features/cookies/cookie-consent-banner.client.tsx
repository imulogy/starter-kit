"use client"

import { useEffect, useState } from "react"

import { COOKIE_CONSENT_STORAGE_KEY } from "@/features/cookies/cookie-consent.constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false)
  const [consent, setConsent] = useState<"all" | "essential" | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) {
      return
    }

    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)

    if (storedConsent === "all" || storedConsent === "essential") {
      setConsent(storedConsent)
    } else {
      setConsent(null)
    }
  }, [mounted])

  const acceptAll = () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "all")
    setConsent("all")
  }

  const acceptNecessaryOnly = () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "essential")
    setConsent("essential")
  }

  if (!mounted || consent !== null) {
    return null
  }

  return (
    <Card
      role="dialog"
      aria-label="Cookie consent"
      className="fixed right-0 bottom-4 left-auto z-100 hidden w-80 pb-2 sm:block md:right-4"
    >
      <CardContent className="space-y-2 pb-0">
        <h5 className="text-xs leading-relaxed text-foreground">We use cookies to improve your experience.</h5>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={acceptAll} variant="default" className="text-xs">
            Accept all
          </Button>
          <Button type="button" size="sm" onClick={acceptNecessaryOnly} variant="outline" className="text-xs">
            Necessary only
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
