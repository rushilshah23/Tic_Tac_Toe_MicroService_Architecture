"use client";
import { SOCKET_CONSTANTS } from "@/configs/socket.config";
import { WebSocketExt } from "@/types/WebSocketExt";
import { useEffect, useState } from "react";

const useWebSocket = (url: string): WebSocketExt | null => {
  const [socket, setSocket] = useState<WebSocketExt | null>(null);

  const startHeartbeat = (socket: WebSocketExt) => {
    console.log("Heartbeat function invoked !")
    const HEARTBEAT_TIMEOUT = SOCKET_CONSTANTS.HEARTBEAT_TIMEOUT; // 5 seconds
    const HEARTBEAT_VALUE = SOCKET_CONSTANTS.HEARTBEAT_VALUE;
    if(!socket){
        return;
    }
    if (!!socket.pingTimeout) {
      clearTimeout(socket.pingTimeout);
    }

    socket.pingTimeout = setTimeout(() => {
      socket.close();
      // Business logic to reconnect or not
    }, HEARTBEAT_TIMEOUT);

    const data = new Uint8Array(1);
    data[0] = HEARTBEAT_VALUE;
    socket.send(data);
    console.log("Heart beated")
    
  
  };

  function isBinary(obj: any) {
    return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Blob]';
    }


  useEffect(() => {
    const ws = new WebSocket(url) as WebSocket;

    ws.addEventListener("open", () => {
      console.log("WebSocket connection established");
      setSocket(ws);
      if (socket) {
        startHeartbeat(socket);
      }
    });

    ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      if (socket) {
        if (socket.pingTimeout) {
          clearTimeout(socket.pingTimeout);
        }
        setSocket(null);
      }
    });

    ws.addEventListener("message", (msg: MessageEvent<string>) => {
        console.log("Received mssg ",msg)
        if(isBinary(msg.data)){
          console.log("received binary data")
        //   if(socket){

              startHeartbeat(ws);

        //   }
        }else{
            // Decode the received message
            
          console.log(`Receieved Non Binary message : ${msg.data}`);
  
        }
      });

    // ... Add other event listeners and logic here

    return () => {
      if (ws) {
        ws.close();
      }

    };
  }, [url]);

  return socket;
};

export default useWebSocket;
