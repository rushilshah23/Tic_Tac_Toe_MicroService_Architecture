"use client";

import { createContext, useContext } from "react";
import { UserMove } from "@/types/UserMove.Interface";

export enum SocketGameActionTypes  {
    INIT_SOCKET="INIT_SOCKET",
    NULL_SOCKET="NULL_SOCKET",
    JOIN_ROOM = "JOIN_ROOM",
    LEAVE_ROOM="LEAVE_ROOM"


}

interface SocketGameActionPayloads {
    [SocketGameActionTypes.INIT_SOCKET] :{socketConnection:WebSocket},
    [SocketGameActionTypes.NULL_SOCKET]:{},
    [SocketGameActionTypes.JOIN_ROOM]:{roomId:string}
    [SocketGameActionTypes.LEAVE_ROOM]:{},
}


export enum  SocketGameActionTypesAsync {
    PLAY_MOVE="PLAY_MOVE",

}



interface SocketGameActionPayloadsAsync{
    [SocketGameActionTypesAsync.PLAY_MOVE]:UserMove
}
  
export type SocketGameAction =  {
    type: SocketGameActionTypes,
    payload:SocketGameActionPayloads[SocketGameActionTypes]
}

export type SocketGameActionAsync =  {
    type: SocketGameActionTypesAsync,
    payload:SocketGameActionPayloadsAsync[SocketGameActionTypesAsync]
}

export const SocketGameDispatchContext = createContext<((action: SocketGameAction) => void) | null>(null);
// export const SocketGameDispatchContextAsync = createContext<((action: SocketGameActionAsync) => void) | null>(null);


export const useSocketGameDispatch = () =>{
    const context = useContext(SocketGameDispatchContext);
    if(!context){
        throw Error("SocketGame Dispatch Context  not defined")
    }
    return context;
}

// export const useSocketGameDispatchAsync = () =>{
//     const context = useContext(SocketGameDispatchContextAsync);
//     if(!context){
//         throw Error("SocketGame Dispatch Context  not defined")
//     }
//     return context;
// }


