import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { EventEmitter } from '../eventEmitter';

const WebSocketContext = createContext<{
  send: (type: string, payload: any) => void;
  on: (type: string, callback: (data: any) => void) => () => void;
  off: (type: string, callback: (data: any) => void) => void;
  createEffectHandler: (type: string, callback: (data: any) => void) => () => void;
}>({} as any);


export const WebSocketProvider = ({ url, children }) => {
  const socketRef = useRef<WebSocket>({} as WebSocket);
  const emitterRef = useRef<EventEmitter>(new EventEmitter());

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
      console.debug(`WebSocket message received: type=${type}, data=`, data);
      emitterRef.current.emit(type, data);
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

  const send = (type: string, payload: any) => {
    const message = JSON.stringify({ type, payload });
    socketRef.current?.send(message);
  };

  const on = (type: string, callback: Function) => emitterRef.current.on(type, callback);
  const off = (type: string, callback: Function) => emitterRef.current.off(type, callback);

  const createEffectHandler = (type: string, callback: Function) => {
    const handler = (data: any) => {
      console.debug(`Effect handler for type=${type} received data:`, data);
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