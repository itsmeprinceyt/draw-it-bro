import { useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

export function useCursorTracking(send: boolean) {
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (send) {
        socket.emit('cursor', { x: e.clientX, y: e.clientY })
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [send])
}
