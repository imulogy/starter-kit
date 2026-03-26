import { AuthRequiredModalProvider } from "@/features/auth/components/auth-required-modal/auth-required-modal-provider.client"
import { DashboardHeader } from "@/components/dashboard/header.client"
import { Sidebar } from "@/components/dashboard/sidebar.client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <AuthRequiredModalProvider>
          <DashboardHeader />
        </AuthRequiredModalProvider>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
