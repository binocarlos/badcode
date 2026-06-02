import { z } from 'zod'

/** GCS bucket that stores all comic assets. */
export const BUCKET = 'badcode-storage'

const IMAGE_POINTER = /\.latest\.(png|jpe?g|webp|svg)$/
const VIDEO_POINTER = /\.latest\.(mp4|webm)$/

const referenceImageSchema = z.object({
  path: z.string(),
  description: z.string().optional(),
})

const characterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  sheet: z.string().regex(IMAGE_POINTER, 'sheet must be a ".latest.<image ext>" pointer'),
  refs: z.array(referenceImageSchema).optional(),
})

const imageAssetSchema = z.object({
  kind: z.literal('image'),
  path: z.string().regex(IMAGE_POINTER, 'image path must be a ".latest.<image ext>" pointer'),
  characters: z.array(z.string()),
  scene: z.string().min(1),
})

const videoAssetSchema = z.object({
  kind: z.literal('video'),
  path: z.string().regex(VIDEO_POINTER, 'video path must be a ".latest.<video ext>" pointer'),
  from: z.string(),
  to: z.string(),
  transition: z.string().min(1),
})

const assetSchema = z.discriminatedUnion('kind', [imageAssetSchema, videoAssetSchema])

export const comicSchema = z
  .object({
    id: z.string().min(1),
    style: z.string().min(1),
    characters: z.record(z.string(), characterSchema),
    assets: z.record(z.string(), assetSchema),
  })
  .superRefine((comic, ctx) => {
    for (const [assetId, asset] of Object.entries(comic.assets)) {
      if (asset.kind === 'image') {
        for (const charId of asset.characters) {
          if (!comic.characters[charId]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `asset "${assetId}" references unknown character "${charId}"`,
              path: ['assets', assetId, 'characters'],
            })
          }
        }
      } else {
        for (const ref of [asset.from, asset.to]) {
          const target = comic.assets[ref]
          if (!target) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `video "${assetId}" references unknown asset "${ref}"`,
              path: ['assets', assetId],
            })
          } else if (target.kind !== 'image') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `video "${assetId}" keyframe "${ref}" must be an image asset`,
              path: ['assets', assetId],
            })
          }
        }
      }
    }
  })

export type Comic = z.infer<typeof comicSchema>
export type Character = z.infer<typeof characterSchema>
export type Asset = z.infer<typeof assetSchema>
export type ImageAsset = z.infer<typeof imageAssetSchema>
export type VideoAsset = z.infer<typeof videoAssetSchema>
