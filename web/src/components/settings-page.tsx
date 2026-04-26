"use client"

import * as React from "react"
import { Settings, Plug, User, Bell, Shield } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { IntegrationsPage } from "@/components/integrations-page"

const NAV = [
  { name: "General",       icon: Settings },
  { name: "Integrations",  icon: Plug     },
  { name: "Account",       icon: User     },
  { name: "Notifications", icon: Bell     },
  { name: "Security",      icon: Shield   },
]

function GeneralContent() {
  return <p className="text-sm text-muted-foreground p-4">General settings coming soon.</p>
}
function AccountContent() {
  return <p className="text-sm text-muted-foreground p-4">Account settings coming soon.</p>
}
function NotificationsContent() {
  return <p className="text-sm text-muted-foreground p-4">Notification settings coming soon.</p>
}
function SecurityContent() {
  return <p className="text-sm text-muted-foreground p-4">Security settings coming soon.</p>
}

export function SettingsDialog({
  trigger,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [active, setActive] = React.useState("Integrations")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Manage your workspace settings.</DialogDescription>

        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {NAV.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          isActive={active === item.name}
                          onClick={() => setActive(item.name)}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex h-[580px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink className="text-muted-foreground">Settings</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{active}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>

            <div className="flex flex-1 flex-col overflow-y-auto">
              {active === "General"       && <GeneralContent />}
              {active === "Integrations"  && <IntegrationsPage />}
              {active === "Account"       && <AccountContent />}
              {active === "Notifications" && <NotificationsContent />}
              {active === "Security"      && <SecurityContent />}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}

// Keep SettingsPage as a thin wrapper so admin/page.tsx import still works
export function SettingsPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <SettingsDialog />
    </div>
  )
}
