export async function getPfpUrl(): Promise<string | undefined> {
  try {
    // Farcaster/MiniKit context (guarded; ignore if not present in preview)
    // @ts-ignore
    const ctx = (window as any)?.miniKit?.context || (window as any)?.frameContext
    const url = ctx?.user?.pfpUrl || ctx?.user?.pfp || ctx?.profileImageUrl
    if (url) return url as string
  } catch {}
  try {
    const fromQuery = new URL(location.href).searchParams.get("pfp")
    if (fromQuery) return fromQuery
  } catch {}
  return undefined
}
