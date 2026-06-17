// Allow importing plain CSS for its side effects (Vite handles the bundling).
declare module '*.css'

// mp4box is loosely typed; we interact with it via `any` casts at the boundary.
declare module 'mp4box'
