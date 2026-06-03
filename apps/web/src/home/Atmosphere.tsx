import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { COLORS } from './colors'

export function Atmosphere() {
  return (
    <>
      <fog attach="fog" args={[COLORS.black, 30, 90]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 20]} intensity={30} color={COLORS.cyan} />
      <Stars radius={120} depth={60} count={1400} factor={3} fade speed={0.4} />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.3} mipmapBlur />
      </EffectComposer>
    </>
  )
}
