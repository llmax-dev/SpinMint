"use client"
import { Suspense } from "react"
import type React from "react"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
