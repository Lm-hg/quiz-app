import { useEffect, useRef, useState } from 'react';
import type { WSMessage, QuizRoom } from '@shared-types';

export const useWebSocket = (url: string) => {
  const [roomState, setRoomState] = useState<QuizRoom | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      
      if (message.type === 'room-state') {
        setRoomState(message.room);
      } else if (message.type === 'error') {
        setError(message.message);
      }
    };

    ws.onerror = () => {
      setError('Erreur de connexion au serveur');
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  const sendMessage = (message: WSMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    roomState,
    connected,
    error,
    sendMessage,
  };
};
