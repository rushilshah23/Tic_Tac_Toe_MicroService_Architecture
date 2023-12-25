
import { WebSocketExt } from "@/types/WebSocketExt";
import { createContext, useContext } from "react";


export interface SocketGameState {
  socket: WebSocketExt | null;
  roomId:string | null;
//   initSocket: () => void;
}

export const initSocketGameState: SocketGameState = {
  socket: null,
  roomId:null
//   initSocket:()=>{},
};

export const SocketGameContext = createContext<SocketGameState>(initSocketGameState);








export const useSocketGameContext = () => {
  const socketGameContext = useContext(SocketGameContext);
  if (!socketGameContext) {
      throw Error("Socket Game context not initialized !");
    }
    
    
  return socketGameContext;
};
