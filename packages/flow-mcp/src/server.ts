import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { NAME, VERSION } from './version'
import { FlowClient } from './flow-client'
import { ok, fail, NOT_RUNNING_HINT, type ToolResult } from './result'

/**
 * Cache the CDP attachment across tool calls: the stdio server process is long-lived, and
 * keeping the same Page preserves image-mode state and Flow's in-session context between
 * edit-loop rounds (as well as saving the attach + page discovery per call). A dead handle
 * (user restarted Chrome) is detected via isAlive() and retried once with a fresh connect;
 * close() on a connectOverCDP browser only detaches — it never kills the user's Chrome.
 */
let cached: FlowClient | null = null
const DISCONNECTED_RE = /Target closed|browser has been closed|Target page, context or browser has been closed|ECONNRESET/i

async function withClient<T>(fn: (c: FlowClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    if (cached && !cached.isAlive()) {
      await cached.close().catch(() => {})
      cached = null
    }
    cached ??= await FlowClient.connect()
    try {
      return await fn(cached)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (attempt === 0 && DISCONNECTED_RE.test(msg)) {
        await cached.close().catch(() => {})
        cached = null
        continue
      }
      throw err
    }
  }
  throw new Error('unreachable')
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
      'Generate an image in Flow from a prompt and save it to outPath (absolute). Pass character to cast a project Character (created via flow_create_character) for cross-slide consistency. numOutputs (1-4, default 1) generates variants in one turn, saved with -a/-b… suffixes and returned as candidates[]. Returns { path, mediaId, width, height }.',
    inputSchema: {
      prompt: z.string().min(1),
      outPath: z.string().min(1),
      character: z.string().min(1).optional(),
      numOutputs: z.number().int().min(1).max(4).optional(),
    },
  },
  async ({ prompt, outPath, character, numOutputs }) => {
    try {
      return await withClient(async (c) =>
        ok(await c.generateImage(prompt, outPath, { ...(character ? { character } : {}), ...(numOutputs ? { numOutputs } : {}) })),
      )
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_edit_image',
  {
    title: 'Edit image with reference',
    description:
      'Generate edited variant(s) of an existing image: uploads referenceImages (absolute local paths) as prompt ingredients, applies the delta prompt, and saves numOutputs (default 2) candidates to outPath with -a/-b… suffixes. Reference the ORIGINAL/golden image, not a previous edit output — chained edits accumulate artifacts. Phrase the prompt as: "Using the provided image, change only <X> to <Y>. Keep everything else in the image exactly the same, preserving the original style, lighting, and composition." Returns { candidates: [{ path, mediaId, width, height }], partial? }.',
    inputSchema: {
      prompt: z.string().min(1),
      referenceImages: z.array(z.string().min(1)).min(1).max(3),
      outPath: z.string().min(1),
      numOutputs: z.number().int().min(1).max(4).optional(),
      character: z.string().min(1).optional(),
    },
  },
  async ({ prompt, referenceImages, outPath, numOutputs, character }) => {
    try {
      return await withClient(async (c) =>
        ok(
          await c.editImage(prompt, referenceImages, outPath, {
            ...(numOutputs ? { numOutputs } : {}),
            ...(character ? { character } : {}),
          }),
        ),
      )
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

server.registerTool(
  'flow_create_character',
  {
    title: 'Create character',
    description:
      'Create a reusable Flow Character from one or more reference image paths (absolute), for cross-slide consistency. Cast it later by typing "@" in the prompt. Returns { name }.',
    inputSchema: {
      name: z.string().min(1),
      refImages: z.array(z.string().min(1)).min(1),
    },
  },
  async ({ name, refImages }) => {
    try {
      return await withClient(async (c) => ok(await c.createCharacter(name, refImages)))
    } catch (err) {
      return toToolError(err)
    }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
