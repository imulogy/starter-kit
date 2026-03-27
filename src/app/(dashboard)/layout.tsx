import { AuthRequiredModalProvider } from "@/features/auth/components/auth-required-modal/auth-required-modal-provider.client"
import { SettingsDialogGlobalBridge } from "@/features/settings/components/settings-dialog/settings-dialog-global-bridge.client"
import { DashboardHeader } from "@/components/dashboard/header.client"
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav.client"
import { Sidebar } from "@/components/dashboard/sidebar.client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="pb-24 md:pb-0">
        <AuthRequiredModalProvider>
          <DashboardHeader />
          <MobileBottomNav />
          <SettingsDialogGlobalBridge />
          {children}
        </AuthRequiredModalProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
