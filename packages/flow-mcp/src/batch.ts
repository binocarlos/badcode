/** Deterministic per-index output path: <outDir>/<NN>.jpg (NN = 2-digit zero-padded index). */
export function batchOutPath(outDir: string, index: number): string {
  const dir = outDir.replace(/\/+$/, '')
  return `${dir}/${String(index).padStart(2, '0')}.jpg`
}
