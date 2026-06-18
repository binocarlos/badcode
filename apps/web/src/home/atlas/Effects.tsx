import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer>
      {/* Glow only the bright lines/nodes — no global blur (DoF returns in Phase 2 to rack-focus plates). */}
      <Bloom intensity={0.55} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
      <Vignette eskil={false} offset={0.35} darkness={0.5} />
    </EffectComposer>
  )
}
