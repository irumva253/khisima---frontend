import React from "react"
import { Outlet } from "react-router-dom"
import { Toaster } from '@/components/ui/sonner'
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import { ThemeProvider } from '@/components/ui/theme-provider' 
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

const AdminDashboard = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
     <Toaster />
      <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
    
  )
}

export default AdminDashboard
