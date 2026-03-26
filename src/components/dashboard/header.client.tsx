"use client"

import { usePathname } from "next/navigation"

import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/web.routes"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { UserButton } from "@/features/auth/components/user-button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const authModalContext = useAuthRequiredModal()
  const currentRoute = Object.values(WebRoutes).find((route) => route.path === pathname)
  const currentLabel = currentRoute?.label ?? "Dashboard"

  const handleSignInClick = () => {
    authModalContext?.openAuthModal()
  }

  return (
    <header className="flex h-[57px] shrink-0 items-center gap-2 border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto pr-4">
        {session?.user?.email ? (
          <UserButton email={session.user.email} />
        ) : (
          <Button type="button" className="min-w-20" variant="outline" onClick={handleSignInClick}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  )
}
