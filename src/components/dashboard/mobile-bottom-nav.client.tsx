"use client"

import { HomeIcon, SparklesIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"
import { WebRoutes } from "@/lib/web.routes"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MobileBottomNav() {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const authModalContext = useAuthRequiredModal()
  const [isPending, startTransition] = useTransition()

  const isActive = (path: string) => {
    if (path === WebRoutes.root.path) {
      return pathname === path
    }

    return pathname.startsWith(path)
  }

  const iconClassName = "size-6"

  const navLinkClassName = (path: string) =>
    cn(
      "flex flex-col items-center justify-center gap-1 rounded-lg px-3.5 py-2.5 transition-colors",
      isActive(path) ? "bg-primary text-white" : "text-foreground hover:bg-muted/50"
    )

  const handleSignInClick = () => {
    authModalContext?.openAuthModal()
  }

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut()
    })
  }

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="safe-area-bottom flex w-full flex-row items-center pt-2.5 pb-1.5">
        <div className="flex min-w-0 flex-1 justify-center">
          <Link href={WebRoutes.root.path} className={navLinkClassName(WebRoutes.root.path)} aria-label="Home">
            <HomeIcon className={cn(iconClassName, isActive(WebRoutes.root.path) && "text-white")} />
          </Link>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <Link href={WebRoutes.askAi.path} className={navLinkClassName(WebRoutes.askAi.path)} aria-label="Ask AI">
            <SparklesIcon className={cn(iconClassName, isActive(WebRoutes.askAi.path) && "text-white")} />
          </Link>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          {session?.user?.email ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex flex-col items-center justify-center gap-1 rounded-lg px-3.5 py-2.5 text-foreground transition-colors hover:bg-muted/50"
                  aria-label="Account"
                >
                  <UserIcon className={iconClassName} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="truncate">{session.user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isPending}>
                  {isPending ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              type="button"
              onClick={handleSignInClick}
              variant="ghost"
              className="flex flex-col items-center justify-center gap-1 rounded-lg px-3.5 py-2.5 text-foreground transition-colors hover:bg-muted/50"
              aria-label="Sign in"
            >
              <UserIcon className={iconClassName} />
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
