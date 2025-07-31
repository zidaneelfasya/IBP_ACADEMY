"use client"

import { LMSSidebar } from "@/Components/lms-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/Components/ui/sidebar"
import { DashboardContent } from "@/Components/dashboard-content"

export default function Dashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <LMSSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">LMS</span>
              </div>
              <span className="font-semibold text-primary">EduPlatform</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">JD</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
