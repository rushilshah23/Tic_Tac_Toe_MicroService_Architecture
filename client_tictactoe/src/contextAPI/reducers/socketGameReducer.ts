"use client";

import { SocketGameState, initSocketGameState } from "../contexts/StateContexts/SocketGameContext";
import { SocketGameAction, SocketGameActionAsync, SocketGameActionTypes, SocketGameActionTypesAsync } from "../contexts/DispatchContexts/SocketGameDispatchContext";
import { isStringObject } from "util/types";
import { socketGameAPI } from "@/apiCalls/socket";
import { SOCKET_CLIENT_EVENTS } from "@/configs/socket.config";
import { WebSocketExt } from "@/types/WebSocketExt";

export  function socketGameReducer(socketGameState: SocketGameState, action: SocketGameAction): SocketGameState {
    switch (action.type) {
        case SocketGameActionTypes.INIT_SOCKET:
            if (action.payload instanceof Object && 'socketConnection' in action.payload) {
              
                    console.log("Socket set in SocketReducer")
                    // const socketConnection = new WebSocket(action.payload.url);
                    return {
                        ...socketGameState,
                        socket: action.payload.socketConnection,
                    };
               

            } else {
                throw Error("Faile to assign Socket in Socket Reducer")
                console.log("Socket URL Missing")
                // Handle the case where the payload doesn't have the expected structure.
                return initSocketGameState;
            }
            break;
        case SocketGameActionTypes.NULL_SOCKET:
            console.log("Socket NULLED in SocketReducer")
            return initSocketGameState
            break;

        case SocketGameActionTypes.JOIN_ROOM:
            if (action.payload instanceof Object && 'roomId' in action.payload) {
                console.log("Setting roomid to ",action.payload.roomId)
       
                return {
                    ...socketGameState,
                    roomId: action.payload.roomId
                }
            } else {
                throw Error("RoomId missing or improper object to join room")
            }
            break;

        case SocketGameActionTypes.LEAVE_ROOM:
            // if (!!socketGameState.socket) {
            //     console.log("SOCKET LEAVE ROOM SOCKETREDUCER")
            //     socketGameState.socket.close();
            // }
            return initSocketGameState;
            break;

     
        default:
            return socketGameState;
            break;

    }
}

// There is nothing fix State to be return here
export async function socketGameDispatchAsync(socketGameState:WebSocketExt, action: SocketGameActionAsync) {
    switch (action.type) {

      case SocketGameActionTypesAsync.PLAY_MOVE:
        if (
          action.payload instanceof Object &&
          'roomId' in action.payload &&
          typeof action.payload.roomId === 'string' &&
          'selectedCell' in action.payload &&
        !!socketGameState
        //   !!socketGameState.socket
        ) {
           socketGameAPI.sendData(socketGameState, SOCKET_CLIENT_EVENTS.PLAY_MOVE, action.payload);
        //    socketGameAPI.sendData(socketGameState.socket, SOCKET_CLIENT_EVENTS.PLAY_MOVE, action.payload);

          console.log("Data sent to the server after API Call")
        }else{
            throw Error("Improper payload object for action PLAY_MOVE")
        }
        break;
      // Handle other async actions...
      // ...
      default:
        break;
    }
  }

