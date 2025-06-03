'use client'

import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { progress, active } = useProgress()
  
  if (!active) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      zIndex: 1000,
    }}>
      <div style={{
        width: '200px',
        height: '4px',
        background: '#333',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'white',
          transition: 'width 0.3s ease-in-out',
        }} />
      </div>
      <p style={{ marginTop: '1rem' }}>
        Loading... {Math.round(progress)}%
      </p>
    </div>
  )
} 