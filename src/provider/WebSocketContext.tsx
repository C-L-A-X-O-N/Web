import { createContext, useContext, useEffect, useRef } from 'react';
import { EventEmitter } from '../eventEmitter';
import { useFocus } from './FocusProvider';

const WebSocketContext = createContext<{
  send: (type: string, payload: any) => void;
  on: (type: string, callback: (data: any) => void) => () => void;
  off: (type: string, callback: (data: any) => void) => void;
  createEffectHandler: (type: string, callback: (data: any) => void) => () => void;
}>({} as any);


export const WebSocketProvider = ({ url, children }) => {
  const socketRef = useRef<WebSocket>({} as WebSocket);
  const emitterRef = useRef<EventEmitter>(new EventEmitter());
  const {isFocused} = useFocus();

  function connect() {
    console.log(`Connecting to WebSocket at ${url}`);
    if(socketRef.current.readyState !== undefined) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        console.log('WebSocket is already open');
        return;
      }
      if (socketRef.current.readyState === WebSocket.CONNECTING) {
        console.log('WebSocket is currently connecting');
        return;
      }
      if (socketRef.current.readyState === WebSocket.CLOSING || socketRef.current.readyState === WebSocket.CLOSED) {
        console.log('WebSocket is closed or closing, creating a new connection');
      }
    }else{
      console.log('WebSocket is not initialized, creating a new connection');
    }
    socketRef.current = new WebSocket(url);

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { type, data } = message;
      emitterRef.current.emit(type, data);
    };

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
      emitterRef.current.emit('connected', {});
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed, attempting to reconnect...');
      setTimeout(connect, 1000);
    };

    return () => {
      socketRef.current?.close();
    };
  }

  useEffect(connect, [url]);

  const send = (type: string, data: any) => {
    const message = JSON.stringify({ type, data });
    if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open. Cannot send message:', message);
      return;
    }
    socketRef.current?.send(message);
  };

  useEffect(() => {
    send("session/focus", { focused: isFocused });
  }, [isFocused]);

  useEffect(() => {
    const interv2 = setInterval(() => {
      if (!isFocused) return; 
      send("session/update_lights", "")
    }, 900)
    
    return () => {
      clearInterval(interv2);
    };
  }, [isFocused, socketRef])

  const on = (type: string, callback: Function) => emitterRef.current.on(type, callback);
  const off = (type: string, callback: Function) => emitterRef.current.off(type, callback);

  on('connected', () => {
    send("session/focus", { focused: true });
  });

  const createEffectHandler = (type: string, callback: Function) => {
    const handler = (data: any) => {
      callback(data);
    };
    on(type, handler);
    return () => off(type, handler);
  };

  return (
    <WebSocketContext.Provider value={{ send, on, off, createEffectHandler }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);