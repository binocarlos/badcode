/** MCP tool return shape (subset of the SDK's CallToolResult). */
export interface ToolResult {
  [key: string]: unknown
  content: { type: 'text'; text: string }[]
  structuredContent?: Record<string, unknown>
  isError?: boolean
}

export const NOT_RUNNING_HINT =
  'Run `./scripts/flow-chrome.sh` and log into Google/Flow, then retry.'

/** Success: encode data as JSON text and as structuredContent. */
export function ok(data: unknown): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data) }],
    structuredContent: data as Record<string, unknown>,
  }
}

/** Failure: a structured error the caller (skill) can branch on. */
export function fail(code: string, message: string, hint?: string): ToolResult {
  const body = hint
    ? { error: true, code, message, hint }
    : { error: true, code, message }
  return { content: [{ type: 'text', text: JSON.stringify(body) }], isError: true }
}
