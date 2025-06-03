'use client'

import { useEffect, useState, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Use the walking model directly since it has both mesh and animation
const MODEL_PATH = '/models/FemaleWalk.glb'

export function Character() {
  const characterRef = useRef<THREE.Group>(null)
  const [rotationY, setRotationY] = useState(Math.PI)
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, shift: false })
  const [error, setError] = useState<string | null>(null)
  const targetPosition = useRef(new THREE.Vector3(0, 1, 0))
  const cameraOffset = useRef(new THREE.Vector3(0, 2, 8))

  // Load the walking character model
  const { scene, animations } = useGLTF(MODEL_PATH)
  const { actions } = useAnimations(animations, scene)

  const { camera } = useThree()

  // Initialize animations and model
  useEffect(() => {
    if (!scene || !animations) {
      setError('Failed to load model or animations')
      return
    }

    console.log('Available animations:', animations.map(a => a.name))
    console.log('Available actions:', Object.keys(actions))

    // Set up the model
    const scale = 1.0
    scene.scale.setScalar(scale)
    scene.position.set(0, 0, 0)
    scene.rotation.y = Math.PI

    // Apply shadows
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Start the animation
    const walkAction = Object.values(actions)[0]
    if (walkAction) {
      walkAction.reset().play()
      walkAction.setEffectiveTimeScale(1)
      walkAction.setEffectiveWeight(1)
      console.log('Started animation:', walkAction.getClip().name)
    }
  }, [scene, animations, actions])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
          setMovement(prev => ({ ...prev, forward: true }))
          break
        case 's':
          setMovement(prev => ({ ...prev, backward: true }))
          break
        case 'a':
          setMovement(prev => ({ ...prev, left: true }))
          break
        case 'd':
          setMovement(prev => ({ ...prev, right: true }))
          break
        case 'shift':
          setMovement(prev => ({ ...prev, shift: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
          setMovement(prev => ({ ...prev, forward: false }))
          break
        case 's':
          setMovement(prev => ({ ...prev, backward: false }))
          break
        case 'a':
          setMovement(prev => ({ ...prev, left: false }))
          break
        case 'd':
          setMovement(prev => ({ ...prev, right: false }))
          break
        case 'shift':
          setMovement(prev => ({ ...prev, shift: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Handle movement
  useFrame((state, delta) => {
    if (!characterRef.current || error) return

    const isMoving = movement.forward || movement.backward || movement.left || movement.right
    const character = characterRef.current

    // Handle animation speed based on movement
    const walkAction = Object.values(actions)[0]
    if (walkAction) {
      if (isMoving) {
        walkAction.paused = false
        walkAction.setEffectiveTimeScale(movement.shift ? 1.5 : 1)
      } else {
        walkAction.paused = true
      }
    }

    // Calculate movement
    const speed = movement.shift ? 5 : 2.5
    const moveVector = new THREE.Vector3(0, 0, 0)
    
    if (movement.forward) moveVector.z -= 1
    if (movement.backward) moveVector.z += 1
    if (movement.left) moveVector.x -= 1
    if (movement.right) moveVector.x += 1

    // Normalize movement vector for consistent speed in all directions
    if (moveVector.length() > 0) {
      moveVector.normalize()
      moveVector.multiplyScalar(speed * delta)
      character.position.add(moveVector)

      // Update rotation based on movement direction
      const angle = Math.atan2(moveVector.x, moveVector.z)
      setRotationY(Math.PI - angle)
    }

    // Smooth character rotation
    character.rotation.y = THREE.MathUtils.lerp(
      character.rotation.y,
      rotationY,
      0.1
    )

    // Update target position for OrbitControls
    if (state.controls && 'target' in state.controls) {
      const target = (state.controls as any).target as THREE.Vector3
      target.lerp(
        new THREE.Vector3(
          character.position.x,
          character.position.y + 1,
          character.position.z
        ),
        0.1
      )
    }
  })

  if (error) {
    console.error('Character Error:', error)
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

  return (
    <group ref={characterRef}>
      <primitive object={scene} dispose={null} />
    </group>
  )
}

// Pre-load model
useGLTF.preload(MODEL_PATH) 