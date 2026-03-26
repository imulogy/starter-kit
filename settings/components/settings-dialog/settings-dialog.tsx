"use client"

import { ChevronLeft, Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { settingsNavItems } from "@/features/settings/constants/settings-nav.constants"
import type {
  SettingsDialogProps,
  SettingsMobileView,
  SettingsSectionId,
  SettingsSessionUser,
} from "@/features/settings/types/settings-dialog.types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

import { SettingsItemIndicator } from "./settings-item-indicator"
import { SettingsSectionContent } from "./settings-section-content"

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const isMobile = useIsMobile()
  const [section, setSection] = useState<SettingsSectionId>("account")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  /** On mobile: show list first (nested nav). 'list' = show nav items, 'section' = show selected section with back. */
  const [mobileView, setMobileView] = useState<SettingsMobileView>("list")

  useEffect(() => {
    if (!open || !isMobile) return
    const id = requestAnimationFrame(() => setMobileView("list"))

    return () => cancelAnimationFrame(id)
  }, [open, isMobile])

  const t = useTranslations("settings")
  const tCommon = useTranslations("common")
  const { data: session } = authClient.useSession()
  const user = session?.user as SettingsSessionUser | undefined

  const accountHasWarning = Boolean(user && user.emailVerified !== true)

  const getItemWarning = (id: SettingsSectionId): string | null => {
    if (id === "account" && accountHasWarning) return t("account.unverified")

    return null
  }

  const handleSectionSelect = (id: SettingsSectionId) => {
    setSection(id)
    setMobileNavOpen(false)
    if (isMobile) setMobileView("section")
  }

  const sectionContentClassName =
    section === "profile"
      ? "flex min-h-0 flex-1 flex-col overflow-hidden"
      : "flex flex-1 flex-col gap-6 overflow-y-auto p-4"

  const renderMobileList = () => (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <span className="text-sm font-medium">{t("title")}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          aria-label={tCommon("close")}
          onClick={() => onOpenChange(false)}
        >
          <X className="size-5" />
        </Button>
      </header>
      <nav className="flex flex-1 flex-col overflow-y-auto p-2">
        {settingsNavItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="h-auto justify-start gap-3 rounded-xl px-4 py-3"
            onClick={() => handleSectionSelect(item.id)}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="flex items-center gap-2">
              <span className="font-medium">{t(`nav.${item.nameKey}`)}</span>
              {getItemWarning(item.id) && <SettingsItemIndicator title={getItemWarning(item.id)!} />}
            </span>
            <ChevronLeft className="ml-auto size-4 rotate-180 text-muted-foreground" aria-hidden />
          </Button>
        ))}
      </nav>
    </>
  )

  const renderMobileSection = () => (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          aria-label={tCommon("back")}
          onClick={() => setMobileView("list")}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <span className="text-sm font-medium">{t(`nav.${section}`)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-9 shrink-0"
          aria-label={tCommon("close")}
          onClick={() => onOpenChange(false)}
        >
          <X className="size-5" />
        </Button>
      </header>
      <div className={sectionContentClassName}>
        <SettingsSectionContent section={section} onOpenChange={onOpenChange} />
      </div>
    </>
  )

  const renderDesktop = () => (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("openMenuAria")}>
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">{t("title")}</SheetTitle>
            <nav className="flex flex-col pt-6">
              {settingsNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={section === item.id ? "secondary" : "ghost"}
                  className="justify-start gap-2 rounded-none px-4 py-3"
                  onClick={() => handleSectionSelect(item.id)}
                >
                  <item.icon className="size-4" />
                  <span>{t(`nav.${item.nameKey}`)}</span>
                  {getItemWarning(item.id) && (
                    <span className="ml-auto">
                      <SettingsItemIndicator title={getItemWarning(item.id)!} />
                    </span>
                  )}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <span className="text-sm font-medium">{t(`nav.${section}`)}</span>
        <DialogClose asChild>
          <Button variant="ghost" size="icon" className="ml-auto size-9 shrink-0" aria-label={tCommon("close")}>
            <X className="size-5" />
          </Button>
        </DialogClose>
      </header>
      <div className={sectionContentClassName}>
        <SettingsSectionContent section={section} onOpenChange={onOpenChange} />
      </div>
    </>
  )

  const renderContent = () => {
    if (isMobile && mobileView === "list") return renderMobileList()
    if (isMobile && mobileView === "section") return renderMobileSection()

    return renderDesktop()
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" hideClose>
          <SheetTitle className="sr-only">{t("title")}</SheetTitle>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{renderContent()}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col overflow-hidden p-0 sm:max-w-[calc(100%-2rem)] md:h-[700px] md:max-h-[700px] md:max-w-[700px] lg:max-w-[900px]"
      >
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("description")}</DialogDescription>
        <SidebarProvider className="min-h-0! flex-1 items-start overflow-hidden">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingsNavItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton isActive={section === item.id} onClick={() => setSection(item.id)}>
                          <item.icon />
                          <span>{t(`nav.${item.nameKey}`)}</span>
                          {getItemWarning(item.id) && (
                            <span className="ml-auto">
                              <SettingsItemIndicator title={getItemWarning(item.id)!} />
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <div
            className={
              section === "profile"
                ? "flex min-h-0 flex-1 flex-col overflow-hidden"
                : "flex max-h-[700px] min-h-0 flex-1 flex-col overflow-y-auto"
            }
          >
            {renderContent()}
          </div>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
