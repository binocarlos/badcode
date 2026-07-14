/**
 * Per-candidate output path for multi-output generations: suffix -a/-b/-c/-d
 * before the extension. A single-output call keeps the caller's path untouched.
 * candidateOutPath('/x/p04.jpg', 0, 2) → '/x/p04-a.jpg'
 */
export function candidateOutPath(outPath: string, index: number, total: number): string {
  if (total <= 1) return outPath
  const suffix = `-${String.fromCharCode(97 + index)}`
  const dot = outPath.lastIndexOf('.')
  const slash = outPath.lastIndexOf('/')
  if (dot <= slash) return outPath + suffix
  return outPath.slice(0, dot) + suffix + outPath.slice(dot)
}
