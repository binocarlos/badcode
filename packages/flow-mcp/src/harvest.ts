import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { mediaRedirectUrl } from './media-url'

/** Structural subset of Playwright's APIResponse. */
export interface ResponseLike {
  url(): string
  body(): Promise<Buffer>
  headers(): Record<string, string>
}

/** Structural subset of Playwright's APIRequestContext (`page.request`). */
export interface RequestLike {
  get(url: string): Promise<ResponseLike>
}

/**
 * The generated <img> src is an authenticated same-origin redirect that an
 * in-page fetch() can't follow (CORS). Playwright's request context follows it
 * server-side with the browser's cookies and exposes the final signed CDN URL.
 */
export async function resolveSignedUrl(request: RequestLike, name: string): Promise<string> {
  const resp = await request.get(mediaRedirectUrl(name))
  return resp.url()
}

/** Download the media bytes (full Node fs — no curl/sandbox handoff) to outPath. */
export async function harvestToFile(
  request: RequestLike,
  name: string,
  outPath: string,
): Promise<void> {
  const resp = await request.get(mediaRedirectUrl(name))
  const bytes = await resp.body()
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, bytes)
}

/** Resolve the media's content-type (e.g. 'video/mp4') — the reliable video-ready signal. */
export async function contentTypeOf(request: RequestLike, name: string): Promise<string> {
  const resp = await request.get(mediaRedirectUrl(name))
  return resp.headers()['content-type'] ?? ''
}
