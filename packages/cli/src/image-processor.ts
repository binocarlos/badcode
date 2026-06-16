import sharp from 'sharp'
import { rgbaToThumbHash } from 'thumbhash'

export interface ImageProcessor {
  /** Intrinsic pixel dimensions of the source image. */
  dimensions(input: string): Promise<{ width: number; height: number }>
  /** Resize to at most `width` px (never upscaling) and write a WebP to `output`. */
  toWebp(input: string, output: string, width: number, quality: number): Promise<void>
  /** Compute a ThumbHash and return it as compact base64 of the raw hash bytes (~33 chars). Decode at runtime via thumbHashToDataURL. */
  thumbhash(input: string): Promise<string>
}

export class SharpImageProcessor implements ImageProcessor {
  async dimensions(input: string): Promise<{ width: number; height: number }> {
    const meta = await sharp(input).metadata()
    if (meta.width == null || meta.height == null) {
      throw new Error(`could not read image dimensions: ${input}`)
    }
    return { width: meta.width, height: meta.height }
  }

  async toWebp(input: string, output: string, width: number, quality: number): Promise<void> {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(output)
  }

  async thumbhash(input: string): Promise<string> {
    // ThumbHash requires the source no larger than 100x100.
    const { data, info } = await sharp(input)
      .resize(100, 100, { fit: 'inside', withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const hash = rgbaToThumbHash(info.width, info.height, data)
    return Buffer.from(hash).toString('base64')
  }
}
