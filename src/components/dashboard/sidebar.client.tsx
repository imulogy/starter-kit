"use client"

import { ChevronRight, HomeIcon, Sparkles, SparklesIcon } from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { SiteConfig } from "@/lib/site-config"
import { WebRoutes } from "@/lib/web.routes"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Home",
      url: WebRoutes.home.path,
      icon: <HomeIcon />,
      isActive: true,
    },
    {
      title: "Ask AI",
      url: WebRoutes.askAi.path,
      icon: <SparklesIcon />,
    },
  ],

  collapsible: {
    title: "Projects",
    items: [
      {
        title: "Project 1",
        url: "#",
        isActive: true,
      },
      {
        title: "Project 2",
        url: "#",
        isActive: false,
      },
    ],
  },
}

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
  const pathname = usePathname()

  const isNavItemActive = (path: string) => {
    if (path === WebRoutes.home.path) {
      return pathname === path
    }

    return pathname.startsWith(path)
  }

  return (
    <SidebarComponent className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-sidebar-primary-foreground">
                  <Sparkles className="size-4" fill="var(--background)" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{SiteConfig.name}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isNavItemActive(item.url)}>
                  <Link href={item.url as Route}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Collapsible
          key={data.collapsible.title}
          title={data.collapsible.title}
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                {data.collapsible.title}{" "}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.collapsible.items.map((collapsibleItem) => (
                    <SidebarMenuItem key={collapsibleItem.title}>
                      <SidebarMenuButton asChild isActive={collapsibleItem.isActive}>
                        <Link href={collapsibleItem.url as Route}>{collapsibleItem.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  )
}
