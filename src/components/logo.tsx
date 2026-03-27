import { SparklesIcon } from "lucide-react"
import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"

import { ClientHoc } from "./client.hoc"

interface LogoProps {
  showTitle?: boolean
}

export function Logo({ showTitle = true }: LogoProps) {
  return (
    <ClientHoc>
      <Link href={WebRoutes.root.path} className="flex items-center gap-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-background">
          <SparklesIcon className="size-4" strokeWidth={1.75} />
        </div>
        {showTitle && (
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">{SiteConfig.name}</span>
          </div>
        )}
      </Link>
    </ClientHoc>
  )
}
