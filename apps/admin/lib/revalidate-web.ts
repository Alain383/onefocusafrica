/**
 * Triggers cache revalidation on the public web app after admin content changes.
 * Falls back silently if WEB_APP_URL or REVALIDATE_SECRET are not configured.
 */
export async function revalidateWebApp(paths: string[]): Promise<void> {
  const webUrl = process.env.WEB_APP_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!webUrl || !secret) {
    // Not configured — skip silently (dev mode or env vars not set yet)
    return
  }

  try {
    const res = await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, paths }),
      // Don't block the admin response for more than 5 seconds
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      console.warn(`Web app revalidation returned ${res.status} for paths: ${paths.join(', ')}`)
    }
  } catch (err) {
    // Network errors are non-fatal — admin still saved the content
    console.warn('Web app revalidation failed (non-fatal):', err)
  }
}
