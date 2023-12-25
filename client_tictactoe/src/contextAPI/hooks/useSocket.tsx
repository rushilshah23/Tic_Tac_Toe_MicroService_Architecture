// "use client";
// import { FC, Fragment, useContext, useEffect, useRef, useState } from "react";
// import { useSocketGameHook } from "@/contextAPI/hooks/useSocketGameHook";
// import { useSocketGameUtilHook } from "@/contextAPI/hooks/useSocketGameUtilHook";
// import { ENV_VAR } from "@/configs/env.config";
// import { WebSocketExt } from "@/types/WebSocketExt";
// import {
//   SOCKET_CLIENT_EVENTS,
//   SOCKET_CONSTANTS,
//   SOCKET_SERVER_EVENTS,
// } from "@/configs/socket.config";
// import { socketGameAPI } from "@/apiCalls/socket";
// import { UserMove } from "@/types/UserMove.Interface";
// import { socketGameDispatchAsync } from "@/contextAPI/reducers/socketGameReducer";
// import { SocketGameActionTypesAsync } from "@/contextAPI/contexts/DispatchContexts/SocketGameDispatchContext";
// import { useSocketGameContext } from "../contexts/StateContexts/SocketGameContext";
// import { useRouter } from "next/navigation";

// export const useSocket = (roomId: string) => {
//   const socketGameContext = useSocketGameContext();
//   const [socketConnection, setSocketConnection] = useState<WebSocketExt | null>(
//     socketGameContext.socket
//   );
//   const [joinedSuccess, setJoinedSuccess] = useState<boolean>(false);
//   const [startGame, setStartGame] = useState<boolean>(false);
//   const renderRef2 = useRef(0);
//   const router = useRouter();

//   const startHeartbeat = () => {
//     // console.log("Heartbeat function invoked !");
//     const HEARTBEAT_TIMEOUT = SOCKET_CONSTANTS.HEARTBEAT_TIMEOUT; // 5 seconds
//     const HEARTBEAT_VALUE = SOCKET_CONSTANTS.HEARTBEAT_VALUE;
//     if (!socketConnection) {
//       return;
//     }
//     if (!!socketConnection.pingTimeout) {
//       clearTimeout(socketConnection.pingTimeout);
//     }

//     socketConnection.pingTimeout = setTimeout(() => {
//       socketConnection.close();
//       // Business logic to reconnect or not
//     }, HEARTBEAT_TIMEOUT);

//     const data = new Uint8Array(1);
//     data[0] = HEARTBEAT_VALUE;
//     socketConnection.send(data);
//     console.log("Heart beated");
//   };

//   function isBinary(obj: any) {
//     return (
//       typeof obj === "object" &&
//       Object.prototype.toString.call(obj) === "[object Blob]"
//     );
//   }

//   // socketGameDispatchAsync({
//   //   type:SocketGameActionTypesAsync.PLAY_MOVE,
//   //   payload:
//   // })
//   const joinRoom = (roomId: string) => {
//     if (!!socketConnection) {
//       socketGameAPI.sendData(socketConnection, SOCKET_CLIENT_EVENTS.JOIN_ROOM, {
//         roomId,
//       });

//       console.log("AFTER JOINING ROOM ", socketConnection);
//     }
//   };

//   const leaveRoom =
//     // useCallback(
//     () => {
//       if (
//         !!socketConnection &&
//         socketConnection.readyState === WebSocket.OPEN
//       ) {
//         if (roomId) {
//           socketGameAPI.sendData(
//             socketConnection,
//             SOCKET_CLIENT_EVENTS.LEAVE_ROOM,
//             {
//               roomId,
//             }
//           );
//           console.log("AFTER LEAVING ROOM ", socketConnection);
//         }
//       }
//     };

//   const sendMove = async (data: UserMove) => {
//     if (!!socketConnection) {
//       // await socketGameDispatchAsync(socketGameContext, {
//       await socketGameDispatchAsync(socketConnection, {
//         type: SocketGameActionTypesAsync.PLAY_MOVE,
//         payload: {
//           roomId: data.roomId,
//           selectedCell: data.selectedCell,
//         },
//       }).then(() => {
//         console.log("Data sent from send Move hook util function ");
//       });
//     }
//   };

//   useEffect(() => {
//     let subscribed = true;
//     if (subscribed === true) {
//       if (!socketConnection) {
//         const connection = new WebSocket(
//           ENV_VAR.SOCKET_PROXY_GATEWAY_URL + ENV_VAR.SOCKET_EXT
//         );

//         connection.onerror = () => {
//           console.log("Connction variable - ", connection);
//           router.replace("/rooms");
//         };

//         setSocketConnection(connection);
//         console.log("Connection established");
//       } else {
//         // socketConnection.addEventListener("open", openHandler);
//         // socketConnection.addEventListener("close", closeHandler);
//       }

//       return () => {
//         // Clear heartbeat timeout
//         if (!!socketConnection && socketConnection.pingTimeout) {
//           clearTimeout(socketConnection.pingTimeout);
//           console.log("PING TIMEOUT CLEARED ");
//           //   socketConnection?.removeEventListener("open", openHandler);
//           //   socketConnection?.removeEventListener("close", closeHandler);
//           // Close socket connection
//           // if (socketConnection ) {
//           leaveRoom();
//           socketConnection.close();
//           setSocketConnection(null);
//           console.log("CONNECTION CLOSED !");
//         }
//         // }
//       };
//     }
//   }, [roomId, socketConnection, router]);

//   useEffect(() => {
//     const openHandler = () => {
//       joinRoom(roomId);

//       console.log("Function executed  - OPEN HANDLER");
//       startHeartbeat();
//     };
//     const closeHandler = () => {
//       leaveRoom();
//       console.log("Function executed  - CLOSE HANDLER");

//       if (socketConnection?.pingTimeout) {
//         clearTimeout(socketConnection.pingTimeout);
//       }
//       socketConnection?.close();
//       setSocketConnection(null);
//     };
//     let subscribed = true;
//     if (!!socketConnection && subscribed) {
//       socketConnection.addEventListener("open", openHandler);
//       socketConnection.addEventListener("close", closeHandler);
//     }

//     return () => {
//       socketConnection?.removeEventListener("open", openHandler);
//     };
//   },);

//   useEffect(() => {
//     const messageHandler = (msg: MessageEvent<string>) => {
//       if (isBinary(msg.data)) {
//         startHeartbeat();
//       } else {
//         const msgData = JSON.parse(msg.data);
//         setJoinedSuccess(true);
//         if (msgData.eventType === SOCKET_SERVER_EVENTS.JOINED_SUCCESS) {
//           setJoinedSuccess(true);
//         }
//         if (msgData.eventType === SOCKET_SERVER_EVENTS.START_GAME) {
//           setStartGame(true);
//         }
//         if (msgData.eventType === SOCKET_SERVER_EVENTS.LEAVE_SUCCESS) {
//           setJoinedSuccess(false);
//           setStartGame(false);
//           socketConnection?.close();
//           setSocketConnection(null);
//         }
//         if (msgData.eventType === SOCKET_SERVER_EVENTS.WAITING_FOR_OTHER_USER) {
//           setStartGame(false);
//         }
//         console.log(`Received Non Binary message: ${msg.data}`);
//       }
//     };
//     let subscribed = true;

//     if (subscribed) {
//       // if (!!socketGameContext.socket) {
//       if (!!socketConnection) {
//         //   socketConnection.onopen = () => {
//         //     if (!!socketConnection) {
//         // socketConnection.addEventListener("open", openHandler);
//         // socketConnection.addEventListener("close", closeHandler);
//         socketConnection.addEventListener("message", messageHandler);
//         console.log("Socket event listeners initialized");

//         renderRef2.current = renderRef2.current + 1;
//         console.log(
//           "Rendered useSocketUtilHook useEffect ",
//           renderRef2.current,
//           " times"
//         );
//       } else {
//         console.log("Socket is still not intiialized in child socket hook ");
//       }
//       //   };
//       // }
//     }
//     return () => {
//       //   socketConnection?.removeEventListener("open", openHandler);
//       // socketConnection?.removeEventListener("close", closeHandler);
//       socketConnection?.removeEventListener("message", messageHandler);
//       subscribed = false;
//     };
//   });

//   return {
//     socketConnection,
//     sendMove,

//     joinedSuccess,
//     startGame,
//   };
// };

// ---------------------------------

"use client";
import { FC, Fragment, useContext, useEffect, useRef, useState } from "react";

import { ENV_VAR } from "@/configs/env.config";
import { WebSocketExt } from "@/types/WebSocketExt";
import {
  SOCKET_CLIENT_EVENTS,
  SOCKET_CONSTANTS,
  SOCKET_SERVER_EVENTS,
} from "@/configs/socket.config";
import { socketGameAPI } from "@/apiCalls/socket";
import { UserMove } from "@/types/UserMove.Interface";
import { socketGameDispatchAsync } from "@/contextAPI/reducers/socketGameReducer";
import { SocketGameActionTypesAsync } from "@/contextAPI/contexts/DispatchContexts/SocketGameDispatchContext";
import { useSocketGameContext } from "../contexts/StateContexts/SocketGameContext";
import { useRouter } from "next/navigation";
import { RoomInterface, initBoardStatus } from "@/types/Room.Interface";

export const useSocket = (roomId: string) => {
  const socketGameContext = useSocketGameContext();
  const [socketConnection, setSocketConnection] = useState<WebSocketExt | null>(
    socketGameContext.socket
  );
  const [joinedSuccess, setJoinedSuccess] = useState<boolean>(false);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [game,setGame] = useState<RoomInterface | null>(null)
  const router = useRouter();
    



  const sendMove = async (data: UserMove) => {
    if (!!socketConnection) {
      // await socketGameDispatchAsync(socketGameContext, {
      await socketGameDispatchAsync(socketConnection, {
        type: SocketGameActionTypesAsync.PLAY_MOVE,
        payload: {
          roomId: data.roomId,
          selectedCell: data.selectedCell,
        },
      }).then(() => {
        console.log("Data sent from send Move hook util function ");
      });
    }
  };

  const startHeartbeat = () => {
    // console.log("Heartbeat function invoked !");
    const HEARTBEAT_TIMEOUT = SOCKET_CONSTANTS.HEARTBEAT_TIMEOUT; // 5 seconds
    const HEARTBEAT_VALUE = SOCKET_CONSTANTS.HEARTBEAT_VALUE;
    if (!socketConnection) {
      return;
    }
    if (!!socketConnection.pingTimeout) {
      clearTimeout(socketConnection.pingTimeout);
    }

    socketConnection.pingTimeout = setTimeout(() => {
        socketConnection?.close();
      // Business logic to reconnect or not
    }, HEARTBEAT_TIMEOUT);

    const data = new Uint8Array(1);
    data[0] = HEARTBEAT_VALUE;
    socketConnection.send(data);
    console.log("Heart beated");
  };
  function isBinary(obj: any) {
    return (
      typeof obj === "object" &&
      Object.prototype.toString.call(obj) === "[object Blob]"
    );
  }
  useEffect(() => {
    let connection: WebSocketExt | null;
    // ---FUCNTIONS



    // socketGameDispatchAsync({
    //   type:SocketGameActionTypesAsync.PLAY_MOVE,
    //   payload:
    // })
    const joinRoom = (roomId: string) => {
      if (!!socketConnection) {
        socketGameAPI.sendData(socketConnection, SOCKET_CLIENT_EVENTS.JOIN_ROOM, {
          roomId,
        });

        console.log("AFTER JOINING ROOM ", connection);
      }
    };

    const leaveRoom =
      // useCallback(
      () => {
          if (roomId) {
              if (socketConnection && socketConnection.readyState === WebSocket.OPEN) {
              socketGameAPI.sendData(
                socketConnection,
              SOCKET_CLIENT_EVENTS.LEAVE_ROOM,
              {
                roomId,
              }
              );
            }
            if (socketConnection?.pingTimeout) {
              clearTimeout(socketConnection.pingTimeout);
            }
            socketConnection?.close();
            setSocketConnection(null);
            console.log("AFTER LEAVING ROOM ", socketConnection);
        }
    };
    
    
    // --------------------
    let subscribed = true;
    if (subscribed === true) {
      if (!socketConnection) {
        const connection = new WebSocket(
          ENV_VAR.SOCKET_PROXY_GATEWAY_URL + ENV_VAR.SOCKET_EXT
        );

            setSocketConnection(connection)



      }else{
        socketConnection.onerror = () => {
            console.log("Connction variable - ", connection);
            router.replace("/rooms");
          };
  
          socketConnection.onopen = () => {
            // setSocketConnection(connection);
            joinRoom(roomId);
            console.log("Connection established");
            startHeartbeat();
            // getLatestGameStatus()

          };
  
          socketConnection.onclose = () => {
            leaveRoom();
          };
      }

      return () => {
        // Clear heartbeat timeout
        // if (!!socketConnection && socketConnection.pingTimeout) {
        //   clearTimeout(socketConnection.pingTimeout);
        //   console.log("PING TIMEOUT CLEARED ");
        //   socketConnection?.removeEventListener("open", openHandler);
        //   socketConnection?.removeEventListener("close", closeHandler);
        // Close socket connection
        // if (socketConnection ) {
        // leaveRoom();
        socketConnection?.close()
        //   socketConnection.close();
        //   setSocketConnection(null);
        console.log("CONNECTION CLOSED !");
        // }
        // }
      };
    }
  }, [roomId, router,socketConnection]);


  useEffect(()=>{
    const getLatestGameStatus =  () =>{
        if(!!socketConnection){
            const getLatestGameRequest = {
                eventType:SOCKET_CLIENT_EVENTS.GET_LATEST_GAME,
                data:{
                    roomId:roomId
                }
            }
            console.log("Getting latest gamee state ",getLatestGameRequest)
            socketConnection.send(JSON.stringify(getLatestGameRequest))
        }
    
    }
    if(!game){
        if(!!socketConnection && socketConnection.readyState === WebSocket.OPEN && joinedSuccess && startGame){
            getLatestGameStatus()
        }
    }
  },[socketConnection,roomId,router,joinedSuccess,startGame,game])

//   useEffect(()=>{
    const messageHandler = (msg: MessageEvent<string>) => {
        if (!!socketConnection) {
          if (isBinary(msg.data)) {
            startHeartbeat();
          } else {
            const msgData = JSON.parse(msg.data);
            setJoinedSuccess(true);
            if (msgData.eventType === SOCKET_SERVER_EVENTS.JOINED_SUCCESS) {
              setJoinedSuccess(true);
            }
            if (msgData.eventType === SOCKET_SERVER_EVENTS.START_GAME) {
              setStartGame(true);
            }
            if (msgData.eventType === SOCKET_SERVER_EVENTS.LEAVE_SUCCESS) {
              setJoinedSuccess(false);
              setStartGame(false);
              socketConnection?.close();
              setSocketConnection(null);
            }
            if (
              msgData.eventType === SOCKET_SERVER_EVENTS.WAITING_FOR_OTHER_USER
            ) {
              setStartGame(false);
            }
            else if(msgData.eventType === SOCKET_SERVER_EVENTS.LATEST_GAME_STATUS){
                const responseGameStatus = msgData.data;
                console.log(responseGameStatus)

                setGame(responseGameStatus);    
                
            

            }
            // console.log(`Received Non Binary message: ${msg.data}`);
          }
        }
      };


    //   let subscribed = true;
    //   if(subscribed && !!socketConnection){
      if( !!socketConnection){

        console.log("Message handlr added")
          socketConnection.onmessage = (msg) => {
              messageHandler(msg);
            };
        }
//   })

  return {
    socketConnection,
    sendMove,

    joinedSuccess,
    startGame,
    game
  };
};
