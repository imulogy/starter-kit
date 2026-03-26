"use client"

import { createContext, useContext, type ReactNode } from "react"

export type AuthRequiredModalContextValue = {
  openAuthModal: () => void
}

export type AuthRequiredModalProviderProps = {
  children: ReactNode
}

export const AuthRequiredModalContext = createContext<AuthRequiredModalContextValue | null>(null)

export function useAuthRequiredModal() {
  const context = useContext(AuthRequiredModalContext)

  if (!context) {
    throw new Error("useAuthRequiredModal must be used within a AuthRequiredModalProvider")
  }

  return context
}
