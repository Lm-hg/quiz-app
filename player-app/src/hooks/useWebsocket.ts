import { useEffect, useRef, useCallback, useState } from 'react'
import type { ClientMessage, ServerMessage } from '../../../packages/shared-types'

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const messageHandlers = useRef<Map<string, (msg: ServerMessage) => void>>(new Map())

  useEffect(() => {
    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      setIsConnected(true)
    }

    ws.current.onclose = () => {
      setIsConnected(false)
    }

    ws.current.onmessage = (event: Event) => {
      const message: ServerMessage = JSON.parse((event as MessageEvent).data)
      
      // Appeller les handlers enregistrés pour ce type de message
      const typeHandlers = messageHandlers.current.get(message.type)
      if (typeHandlers) {
        typeHandlers(message)
      }
    }

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close()
      }
    }
  }, [url])

  const send = useCallback((message: ClientMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }, [])

  const on = useCallback(
    (type: ServerMessage['type'], handler: (msg: ServerMessage) => void) => {
      messageHandlers.current.set(type, handler)

      return () => {
        messageHandlers.current.delete(type)
      }
    },
    []
  )

  return { send, on, isConnected }
}
