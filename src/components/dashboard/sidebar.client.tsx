"use client"

import { ChevronRight, HomeIcon, SparklesIcon } from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { WebRoutes } from "@/lib/web.routes"
import { SearchForm } from "@/components/dashboard/search-form"
import { Logo } from "@/components/logo"
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
      url: WebRoutes.root.path,
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
        isActive: false,
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
    if (path === WebRoutes.root.path) {
      return pathname === path
    }

    return pathname.startsWith(path)
  }

  return (
    <SidebarComponent className="border-r-0" {...props}>
      <SidebarHeader className="border-b pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SearchForm />

        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isNavItemActive(item.url) ? true : undefined}>
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
                      <Link
                        href={collapsibleItem.url as Route}
                        className="flex h-8 items-center rounded-md px-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        {collapsibleItem.title}
                      </Link>
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
