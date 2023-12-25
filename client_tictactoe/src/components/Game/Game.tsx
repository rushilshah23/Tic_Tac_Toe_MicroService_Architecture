// "use client";
// import { FC, Fragment, useContext, useEffect, useRef, useState } from "react";
// import Board from "./Board/Board";
// import { useSocketGameHook } from "@/contextAPI/hooks/useSocketGameHook";
// import { redirect } from "next/navigation";
// import { useSocketGameUtilHook } from "@/contextAPI/hooks/useSocketGameUtilHook";
// import { SocketGameContext, useSocketGameContext } from "@/contextAPI/contexts/StateContexts/SocketGameContext";
// import { socketInstance } from "@/contextAPI/services/SocketService";
// import { CONSTANTS } from "@/configs/constants.config";
// import { ENV_VAR } from "@/configs/env.config";

// interface GameProps {
//   roomId: string;
// }
// // Import statements remain unchanged

// const Game: FC<GameProps> = ({ roomId }) => {
//   // useSocketGameHook()
//   const {joinRoom,leaveRoom,sendMove,} = useSocketGameHook();
//   const socketGameContext=useSocketGameContext()

//   // const { joinRoom, leaveRoom } = useSocketGameUtilHook();
//   const [roomJoined, setRoomJoined] = useState<boolean | null>(null);

//   // const createSocket = () =>{

//   //   try {
//   //     socketInstance.connect(ENV_VAR.SOCKET_PROXY_GATEWAY_URL + ENV_VAR.SOCKET_EXT)

//   //   } catch (error) {
//   //     throw Error("Failed to init WebSocket Connection");
//   //   }
//   // }
//   //   const renderCount = useRef(0);

//   //   useEffect(() => {
//   //     const joinRoom = () => {
//   //       createSocket();
//   //       if (socketInstance && !roomJoined) {
//   //         socketInstance?.joinRoom(roomId);
//   //         setRoomJoined(true);
//   //       }
//   //     };

//   //     joinRoom();

//   //     return () => {
//   //       // if (socketInstance && roomJoined) {
//   //         socketInstance.leaveRoom(roomId);
//   //       // }
//   //     };
//   //   }, [roomId]);

//   useEffect(() => {
//     let subscribed = true;

//     const callbackFunc = () => {
//       if (!!socketGameContext.socket && socketGameContext.roomId === null) {
//         joinRoom(roomId);
//         setRoomJoined(true);
//       }
//       else {

//         console.log("Socket not initilized ",socketGameContext.socket)
//         // leaveRoom();
//         setRoomJoined(false);
//       }
//     };

//     if (subscribed && (roomJoined === null || roomJoined === false)) {
//       callbackFunc();
//     }

//     return () => {
//       leaveRoom()
//       subscribed = false;
//     };
//   });

//   if (roomJoined === null) {
//     return <h1>Loading Game...</h1>;
//   }

//   return roomJoined  && socketGameContext.socket ? <Board /> : <h1>Socket room not initialized properly</h1>;
// };

// export default Game;

"use client";
import React, { FC, Fragment, useContext, useEffect, useRef, useState } from "react";
import Board from "./Board/Board";
import { useSocket } from "@/contextAPI/hooks/useSocket";

interface GameProps {
  roomId: string;
}
// Import statements remain unchanged

const Game: FC<GameProps> = ({ roomId }) => {
  const [roomJoined, setRoomJoined] = useState<boolean | null>(null);
  const { socketConnection, sendMove, startGame, joinedSuccess, game } =
    useSocket(roomId);

  return  !!socketConnection ? (
    joinedSuccess ? (
      startGame ? 
        game ?
        (
        <React.Fragment>
          <h3>{game?.information}</h3>
        <Board
          roomId={roomId}
          socketConnection={socketConnection}
          sendMove={sendMove}
          game={game}
          />
          </React.Fragment>
      ):(<h2>Getting game state ...</h2>) : (
        <h2>Waiting for another player to join ...</h2>
      )
    ) : (
      <h2>Joining Room ...</h2>
    )
  ) : (
    <h2>Loading...</h2>
  );





};

export default Game;
