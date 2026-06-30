import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { NAME, VERSION } from './version'
import { FlowClient } from './flow-client'
import { ok, fail, NOT_RUNNING_HINT, type ToolResult } from './result'

/** Connect per call: the browser is long-lived; the CDP attach is cheap and avoids stale handles. */
async function withClient<T>(fn: (c: FlowClient) => Promise<T>): Promise<T> {
  const client = await FlowClient.connect()
  try {
    return await fn(client)
  } finally {
    await client.close() // detaches the CDP connection; does NOT close the user's Chrome
  }
}

function toToolError(err: unknown): ToolResult {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('ECONNREFUSED') || msg === 'NO_CONTEXT') {
    return fail('NOT_RUNNING', 'Could not attach to Chrome on the CDP port.', NOT_RUNNING_HINT)
  }
  if (msg === 'TIMEOUT') return fail('TIMEOUT', 'Flow did not finish generating in time.')
  if (msg === 'PROJECT_NOT_FOUND') return fail('PROJECT_NOT_FOUND', 'No Flow project with that name.', 'Check the name in the Flow projects list.')
  return fail('FLOW_ERROR', msg)
}

const server = new McpServer({ name: NAME, version: VERSION })

server.registerTool(
  'flow_status',
  {
    title: 'Flow status',
    description: 'Check whether the Flow browser is attached and logged in.',
    inputSchema: {},
  },
  async () => {
    try {
      return await withClient(async (c) => ok(await c.status()))
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_open_project',
  {
    title: 'Open project',
    description: 'Open an existing Flow project by its exact name (e.g. "camping-v2"). Errors PROJECT_NOT_FOUND if absent.',
    inputSchema: { name: z.string().min(1) },
  },
  async ({ name }) => {
    try {
      return await withClient(async (c) => {
        await c.openProject(name)
        return ok(await c.status())
      })
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_generate_image',
  {
    title: 'Generate image',
    description:
      'Generate ONE image in Flow from a prompt and save it to outPath (absolute). Returns { path, mediaId, width, height }.',
    inputSchema: {
      prompt: z.string().min(1),
      outPath: z.string().min(1),
    },
  },
  async ({ prompt, outPath }) => {
    try {
      return await withClient(async (c) => ok(await c.generateImage(prompt, outPath)))
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_refine',
  {
    title: 'Refine last image',
    description:
      'Send a follow-up correction in the SAME Flow session and save the new image to outPath. Returns { path, mediaId }.',
    inputSchema: {
      prompt: z.string().min(1),
      outPath: z.string().min(1),
    },
  },
  async ({ prompt, outPath }) => {
    try {
      return await withClient(async (c) => ok(await c.refine(prompt, outPath)))
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_generate_video',
  {
    title: 'Generate video',
    description:
      'Animate an image (image→video / Veo). Uploads imagePath, applies the motion prompt, saves the .mp4 to outPath. Returns { path, mediaId }.',
    inputSchema: {
      imagePath: z.string().min(1),
      motion: z.string().min(1),
      model: z.string().optional(),
      outPath: z.string().min(1),
    },
  },
  async ({ imagePath, motion, model, outPath }) => {
    try {
      return await withClient(async (c) => ok(await c.generateVideo(imagePath, motion, outPath, model)))
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_generate_batch',
  {
    title: 'Generate image batch',
    description:
      'Generate N images sequentially in ONE Flow session from an ordered list of prompts. Saves <outDir>/<NN>.jpg per slide. Returns BatchItem[]. Use after planning all slide prompts up front.',
    inputSchema: {
      prompts: z.array(z.string().min(1)).min(1).max(8),
      outDir: z.string().min(1),
    },
  },
  async ({ prompts, outDir }) => {
    try {
      return await withClient(async (c) => ok(await c.generateBatch(prompts, outDir)))
    } catch (err) {
      return toToolError(err)
    }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
