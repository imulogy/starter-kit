"use client"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function SettingsNotificationsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <div className="space-y-2 pl-11">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-full max-w-sm" />
          <Skeleton className="h-6 w-9 rounded-full" />
        </div>
      </section>
      <Separator />
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-72" />
          </div>
        </div>
        <div className="space-y-2 pl-11">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full max-w-sm" />
          <Skeleton className="h-6 w-9 rounded-full" />
        </div>
      </section>
    </div>
  )
}
