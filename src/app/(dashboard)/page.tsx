import type { Metadata } from "next"

import { WebRoutes } from "@/lib/web.routes"
import { SeoPageJsonLd } from "@/components/seo/seo-page-json-ld"

const title = "Home Dashboard"
const description = "Manage your workspace, jump into Ask AI, and navigate your Starter Kit dashboard."
const canonical = WebRoutes.root.withBaseUrl()

export const metadata: Metadata = {
  title,
  description,
  keywords: ["starter kit", "dashboard", "workspace", "ai"],
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
      <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
      <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
    </div>
  )
}
