"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  ChevronDown,
  ChevronsUpDown,
  Home,
  Inbox,
  BarChart2,
  BookOpen,
  Bot,
  Settings,
  Users,
  Plus,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrgItem {
  _id: string;
  name: string;
  slug: string;
  role: string;
}

interface AgentItem {
  _id: string;
  name: string;
  slug: string;
}

interface AdminSidebarShellProps {
  children: React.ReactNode;
  orgs: OrgItem[];
  agents: AgentItem[];
  orgSlug: string;
  agentSlug: string;
}

function SidebarInner({
  orgs,
  agents,
  orgSlug,
  agentSlug,
}: Omit<AdminSidebarShellProps, "children">) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isMobile } = useSidebar();

  const conversations = useQuery(api.conversations.getConversations, { agentId: "" as any });
  const unopenedCount = 0; // will be populated once agentId is wired

  const base = `/${orgSlug}/${agentSlug}`;

  const navItems = [
    { label: "Home", href: `${base}`, icon: Home, exact: true },
    { label: "Inbox", href: `${base}/inbox`, icon: Inbox },
    { label: "Analytics", href: `${base}/analytics`, icon: BarChart2 },
    { label: "Knowledge", href: `${base}/knowledge`, icon: BookOpen },
    { label: "Agent", href: `${base}/config`, icon: Bot },
    { label: "Settings", href: `/${orgSlug}/settings`, icon: Settings },
    { label: "Members", href: `/${orgSlug}/members`, icon: Users },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          {/* Org switcher */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                    <Image src="/maagic-logo.png" alt="Maagic" width={32} height={32} className="object-contain" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{orgs.find((o) => o.slug === orgSlug)?.name ?? orgSlug}</span>
                    <span className="truncate text-xs text-muted-foreground">Organization</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side={isMobile ? "bottom" : "right"}
                align="start"
                sideOffset={4}
              >
                {orgs.map((org) => (
                  <DropdownMenuItem key={org._id} asChild>
                    <Link href={`/${org.slug}`} className="flex flex-col items-start gap-0.5">
                      <span className="font-medium">{org.name}</span>
                      <span className="text-xs text-muted-foreground">{org.role}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/onboarding/create-org" className="gap-2 flex items-center">
                    <Plus className="size-4" />
                    <span>New organization</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/* Agent switcher */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between bg-muted text-muted-foreground hover:bg-muted/80 border-sidebar-border"
                >
                  <span className="text-sm font-medium truncate">
                    {agents.find((a) => a.slug === agentSlug)?.name ?? agentSlug}
                  </span>
                  <ChevronDown className="ml-2 size-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side={isMobile ? "bottom" : "right"}
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel>Agents</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {agents.map((agent) => (
                  <DropdownMenuItem key={agent._id} asChild>
                    <Link href={`/${orgSlug}/${agent.slug}/inbox`}>
                      <span className="font-medium">{agent.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/onboarding/create-agent?orgSlug=${orgSlug}`} className="gap-2 flex items-center">
                    <Plus className="size-4" />
                    <span>New agent</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton isActive={isActive(item.href, item.exact)} asChild>
                  <Link href={item.href} className="flex items-center gap-2 w-full">
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                    {item.label === "Inbox" && unopenedCount > 0 && (
                      <SidebarMenuBadge>{unopenedCount}</SidebarMenuBadge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserFooter onLogout={handleLogout} isMobile={isMobile} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function UserFooter({ onLogout, isMobile }: { onLogout: () => void; isMobile: boolean }) {
  const { isAuthenticated } = useConvexAuth();
  const viewer = useQuery(api.users.viewer);

  const name = viewer?.name ?? viewer?.email ?? "User";
  const email = viewer?.email ?? "";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={viewer?.image ?? ""} alt={name} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={viewer?.image ?? ""} alt={name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminSidebarShell({
  children,
  orgs,
  agents,
  orgSlug,
  agentSlug,
}: AdminSidebarShellProps) {
  return (
    <SidebarProvider>
      <SidebarInner orgs={orgs} agents={agents} orgSlug={orgSlug} agentSlug={agentSlug} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
