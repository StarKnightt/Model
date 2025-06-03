'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, ContactShadows, Backdrop } from '@react-three/drei'
import { Suspense } from 'react'
import { Character } from './Character'
import { LoadingScreen } from './LoadingScreen'

const Scene = () => {
  return (
    <>
      <LoadingScreen />
      <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
        <Canvas
          shadows
          camera={{ position: [0, 2, 8], fov: 45 }}
          style={{ background: '#f0f0f0' }}
        >
          <Suspense fallback={null}>
            <Character />
            <Environment preset="studio" />
            <OrbitControls
              target={[0, 1, 0]}
              maxPolarAngle={Math.PI * 0.75}
              minPolarAngle={0}
              minDistance={3}
              maxDistance={15}
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              makeDefault
            />
            <Grid
              renderOrder={-1}
              position={[0, 0, 0]}
              infiniteGrid
              cellSize={1}
              cellThickness={0.5}
              cellColor="#a0a0a0"
              sectionSize={3}
              sectionThickness={1}
              sectionColor="#808080"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={true}
            />
            <ContactShadows
              opacity={0.2}
              scale={10}
              blur={2}
              far={10}
              resolution={256}
              color="#000000"
            />
            <Backdrop
              receiveShadow
              floor={0.25}
              segments={20}
              scale={[20, 5, 5]}
              position={[0, -0.5, -3]}
            >
              <meshStandardMaterial color="#ffffff" />
            </Backdrop>
          </Suspense>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.2}
          />
        </Canvas>
      </div>
    </>
  )
}

export default Scene 