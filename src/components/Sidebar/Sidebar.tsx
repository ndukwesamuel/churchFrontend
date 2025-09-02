import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  PenTool,
  Megaphone,
  FileText,
  Folder,
  Settings,
} from "lucide-react";

export default function AppSidebar() {
  const location = useLocation();

  function isActiveLink(path: string) {
    return location.pathname === path;
  }

  const tabs = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/contacts",
      label: "Contacts",
      icon: Users,
    },
    {
      path: "/compose",
      label: "Compose",
      icon: PenTool,
    },
    {
      path: "/campaigns",
      label: "Campaigns",
      icon: Megaphone,
      badge: "3", // Example badge for active campaigns
    },
    {
      path: "/templates",
      label: "Templates",
      icon: FileText,
    },
    {
      path: "/files",
      label: "Files",
      icon: Folder,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">
              CC
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">ChurchComm</h1>
            <p className="text-xs text-muted-foreground">Communication Hub</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = isActiveLink(tab.path);

                return (
                  <SidebarMenuItem key={tab.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full",
                        isActive &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      <Link
                        to={tab.path}
                        className="flex items-center space-x-3"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1">{tab.label}</span>
                        {tab.badge && (
                          <Badge
                            variant={isActive ? "secondary" : "default"}
                            className="ml-auto h-5 min-w-[20px] text-xs"
                          >
                            {tab.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="text-center">
          <Separator className="mb-3" />
          <div className="text-xs text-muted-foreground">
            <p>ChurchComm v2.1</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

// Wrapper component to provide SidebarProvider context
export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b p-4 md:hidden">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
