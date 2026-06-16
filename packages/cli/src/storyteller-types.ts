// packages/cli/src/storyteller-types.ts
// Mirrors the Storyteller REST API wire format (snake_case field names preserved).

export interface StorytellerMedia {
  id: string
  prompt: string
  media_type: string
  path: string
}

export interface StorytellerAnimationFrame {
  index: number
  /** Bucket-relative storage key (download via the GCS base URL). */
  path: string
  /** Pre-signed/absolute URL, when provided by the API. */
  url: string
}

export interface StorytellerAnimationData {
  method: string
  frame_count: number
  transition_prompt: string
  frames: StorytellerAnimationFrame[]
  status: string
}

export interface StorytellerTextBubble {
  id: string
  type: string
  text: string
  x?: number
  y?: number
  width?: number
  font_size?: number
  direction?: string
  font_family?: string
  text_color?: string
  background_color?: string
  renderer?: string
  start_percent?: number
  end_percent?: number
  transition?: string
}

export interface StorytellerPageMedia {
  id: string
  media: StorytellerMedia
}

export interface StorytellerPage {
  id: string
  name?: string
  storage_folder?: string
  layout: string
  images: Record<string, StorytellerPageMedia>
  text_bubbles: StorytellerTextBubble[]
  animation?: StorytellerAnimationData
}

export interface StorytellerCharacter {
  id: string
  name: string
  description: string
}

export interface StorytellerComicConfig {
  name: string
  description: string
  style: string
  characters: StorytellerCharacter[]
  pages: StorytellerPage[]
}

export interface StorytellerComic {
  id: string
  /** Absent on comics that haven't been configured yet. */
  config?: StorytellerComicConfig
}
