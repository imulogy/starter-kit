export const baseUrl = process.env.NEXT_PUBLIC_DOMAIN!

type RouteDefinition = {
  label: string
  path: string
  withBaseUrl: () => string
}

function createRoute(label: string, path: string): RouteDefinition {
  return {
    label,
    path,
    withBaseUrl: () => {
      if (!baseUrl) {
        return path
      }

      return `${baseUrl.replace(/\/$/, "")}${path}`
    },
  }
}

export const WebRoutes = {
  root: createRoute("Home", "/"),
  search: createRoute("Search", "/search"),
  askAi: createRoute("Ask AI", "/ai"),
  inbox: createRoute("Inbox", "/inbox"),
  unsubscribe: createRoute("Unsubscribe", "/unsubscribe"),
  verifyEmail: createRoute("Verify Email", "/verify-email"),
} as const
