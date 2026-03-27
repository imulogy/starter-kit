import type { Metadata } from "next"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { SeoPageJsonLd } from "@/components/seo/seo-page-json-ld"

const title = "Home Dashboard"
const description = "Manage your workspace, jump into Ask AI, and navigate your " + SiteConfig.name + " dashboard."
const canonical = WebRoutes.root.withBaseUrl()

export const metadata: Metadata = {
  title,
  description,
  keywords: SiteConfig.keywords,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-10">
      <SeoPageJsonLd name={title} description={description} url={canonical} />
      <h1>{SiteConfig.name}</h1>
    </div>
  )
}
