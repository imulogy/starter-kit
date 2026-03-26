import { SparklesIcon } from "lucide-react"
import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"

export function Logo({ renderTitle = true }: { renderTitle?: boolean }) {
  return (
    <Link href={WebRoutes.root.path} className="flex items-center gap-2">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-sidebar-primary-foreground">
        <SparklesIcon className="size-4" fill="var(--background)" strokeWidth={2} />
      </div>
      {renderTitle && (
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold">{SiteConfig.name}</span>
        </div>
      )}
    </Link>
  )
}
