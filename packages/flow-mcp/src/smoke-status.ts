// Usage: npx tsx packages/flow-mcp/src/smoke-status.ts
import { FlowClient } from './flow-client'
const c = await FlowClient.connect()
try { console.log('status:', await c.status()) } finally { await c.close() }
