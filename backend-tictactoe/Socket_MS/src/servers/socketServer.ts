import express, { Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import WebSocket from "ws";
import bodyParser from "body-parser";
import { AuthRequest } from "@/types/AuthRequest.Interface";
import { ENV_VAR, ENV_VAR as config } from "@/configs/env.config";
import helmet from "helmet";
import { Socket } from "net";
import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import { Cookies } from "@/types/Cookies.enum";
import rabbitMQClientMode from "@/services/client/rabbitMQClientMode";
import { initializeRabbitMQ } from "@/services/serviceInit";
import { ResponseInterface } from "@/types/Response.interface";
import { SOCKET_CLIENT_EVENTS, SOCKET_CONSTANTS, SOCKET_MICROSERVICE_EVENTS, SOCKET_SERVER_EVENTS } from "@/configs/socket.config";

const HEARTBEAT_INTERVAL = SOCKET_CONSTANTS.HEARTBEAT_TIMEOUT;
const HEARTBEAT_VALUE = SOCKET_CONSTANTS.HEARTBEAT_VALUE;

const socketApp = express();

let attempt_no = 0;

// MIDDLEWARES
socketApp.use(
  cors({
    credentials: true,
    origin: config.CLIENT_URL,
  })
);

socketApp.use(cookieParser(config.COOKIE_PARSER_SECRET));
socketApp.use(express.json());
socketApp.use(helmet());
socketApp.use(bodyParser.json());
socketApp.use(bodyParser.urlencoded({ extended: true }));

const socket_port = Number(config.SOCKET_PORT);

const socketServer = socketApp.listen(socket_port, async () => {
  console.log(`WebSocket server running at ws://localhost:${socket_port}`);
  await initializeRabbitMQ();
});

const ping = (ws: WebSocket) => {
  ws.send(HEARTBEAT_VALUE, { binary: true });
};

const onSocketPreError = (e: Error) => {
  console.log("Socket Pre Error ", e);
};

const onSocketPostError = (e: Error) => {
  console.log("Socket Pre Error ", e);
};

const destroySocket = (socket: Socket) => {
  console.log("Authentication failed - Destroying socket !");
  socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  socket.destroy();
  return;
};





const wss = new WebSocket.Server({ noServer: true });

// Upgrade the HTTP server to support WebSocket connections

try {
  socketServer.on(
    "upgrade",
    async (request: AuthRequest, socket: Socket, head: any) => {
      console.log("HTTPS protocol upgrading started...");

      socket.on("error", onSocketPreError);
      cookieParser(ENV_VAR.COOKIE_PARSER_SECRET)(
        request,
        {} as Response,
        async () => {
          const signedCookies = request.signedCookies;
          let accessToken = signedCookies[Cookies.ACCESSTOKEN];
          let refreshToken = signedCookies[Cookies.REFRESHTOKEN];

          // if((!accessToken && !refreshToken) && !!request.url){
          //   const url = new URL(request.url,`ws://${request.headers.host}`);
          //   accessToken = url.searchParams.get(Cookies.ACCESSTOKEN);
          //   refreshToken = url.searchParams.get(Cookies.REFRESHTOKEN);
          // }else{
          //   destroySocket(socket);
          // }

          if (!!!accessToken || !!!refreshToken) {
            destroySocket(socket)
          }


          const tokens = {
            access: accessToken,
            refresh: refreshToken,
          };

          const res: ResponseInterface =
            await rabbitMQClientMode.produceToServer(
              {
                eventType:
                  rabbitMQConfig.CLIENT_MODE.SOCKET.EVENTS.GET_AUTH.toString(),
                data: { tokens: tokens },
              },
              rabbitMQConfig.CLIENT_MODE.SOCKET.QUEUES.REQUEST_QUEUES.AUTH_REQUEST_SERVER.toString()
            );
          // console.log("Response object - ", res);

          if (res.status >= 300) {
            destroySocket(socket);
          } else {
            request.user = res.data.user;
            console.log("Socket Successfully authenticated!");
            wss.handleUpgrade(request, socket, head, async (ws) => {
              socket.removeListener("error", onSocketPreError);
              wss.emit("connection", ws, request);
            });
          }
        }
      );

      // });
    }
  );
} catch (error) {
  console.log("Socket handling error:- ", error);
}


// Map to store connected clients
const roomsMap = new Map<string, Map<string, WebSocket & { isAlive?: boolean }>>();

// WebSocket connection established
wss.on(
  "connection",
  async (ws: WebSocket & { isAlive?: boolean }, request: AuthRequest) => {
    ws.isAlive = true;

    ws.on("error", onSocketPostError);

    attempt_no += 1;
    console.log("Client connected: ", request.user?.emailId, "  Attempt no - ", attempt_no);


    // Get userId and roomId (assuming you have this information from the request)
    const userId = request.user?.userId!;





    // ... (other connection handling code)

    // Handle messages received from the client
    ws.on("message", (data: any, isBinary: boolean) => {
      if (isBinary && data[0] === HEARTBEAT_VALUE) {
        console.log("Pong")
        ws.isAlive = true
      } else {
        console.log("Message by: ", request.user?.emailId);
        const message = JSON.parse(data);
        // Determine the event type and handle it
        handleWebSocketEvent(message, request, ws, false);
      }
    });

    // Handle WebSocket connection closure
    ws.on("close", () => {
      console.log("Client disconnected:", request.user?.emailId);

      roomsMap.forEach((roomMap, roomId) => {
        roomMap.forEach((userSocket, userId) => {
          if (userSocket === ws) {
            // Remove the user's connection from the roomsMap of that room
            roomMap.delete(userId);
            console.log(`Removed user ${userId} from room ${roomId}`);

            console.log("----- ", request.user?.emailId, "------REMOVED FROM THE ROOM-------")
            // console.log(roomsMap.get(roomId))
            console.log("-----------------------------------")
          }
        });
      });

    });
  }
);


const checkActivePlayerStatus = async (message: any, res: any,) => {

  // No check  if both users have joined the room
  // let newMssg = {
  //   data: {
  //     roomId: message.data.roomId,
  //     userId: message.data.userId
  //   },
  //   eventType: SOCKET_MICROSERVICE_EVENTS.GET_ROOM_PLAYER_STATUS
  // }
  // res = await rabbitMQClientMode.produceToServer(
  //   JSON.stringify(newMssg),
  //   rabbitMQConfig.CLIENT_MODE.SOCKET.QUEUES.REQUEST_QUEUES.GENERAL_REQUEST_SERVER.toString()
  // )

  // WRITE A CODE HERE TO GET COUNT OF TOTAL ACRTIVE PLAYERS IN THE ROOM
  let resp: ResponseInterface = {
    data: { "mssage": "Yet to check game start status" },
    status: 500
  }
  const activePlayersCount = roomsMap.get(message.data.roomId)?.size;
  if (activePlayersCount === 2) {
    resp.status = 200
  }
  // console.log("Active status for player response --------------- ")
  // console.log(res);
  // console.log("Active status for player response --------------- ")

  let resData: any;
  if (resp.status === 200) {
    // Add the WebSocket connection to the map based on userId and roomId
    // clientsMap.get(res.data.user.userId)?.set(res.data.roomId, ws);
    resData = {
      eventType: SOCKET_SERVER_EVENTS.START_GAME,
      // data: res
      data: {}
    }


  } else {
    resData = {
      eventType: SOCKET_SERVER_EVENTS.WAITING_FOR_OTHER_USER,
      // data: res
      data: {}
    }
  }

  console.log("Active status ------------")
  console.log(resData.eventType)
  console.log("------------")

  // console.log("------------------")
  // console.log(roomsMap)
  // console.log("------------------")

  if (roomsMap.get(message.data.roomId)) {
    roomsMap.get(message.data.roomId)?.forEach((userId) => {
      userId.send(JSON.stringify(resData))
    })
  }
}

wss.on("close", () => {
  clearInterval(heartBeatInterval)

  console.log("WebSocket server connection closed");
});

const heartBeatInterval = setInterval(() => {
  console.log("Firing Heartbeat Interval ...")
  wss.clients.forEach((client) => {
    const customClient = client as WebSocket & { isAlive?: boolean };
    if (!customClient.isAlive) {
      customClient.terminate();
      return;
    }
    customClient.isAlive = false;
    ping(customClient)

  })
}, HEARTBEAT_INTERVAL)






// Communicate UserId from socketId


// ... (other server setup code)



// Sending messages to specific clients based on userId and roomId
const sendMessageToClient = (userId: string, roomId: string, message: any, eventType: SOCKET_SERVER_EVENTS) => {
  if (roomsMap.has(roomId)) {
    const roomMap = roomsMap.get(roomId);
    if (roomMap?.has(userId)) {
      const ws = roomMap.get(userId);
      message.eventType = eventType
      console.log("Sending to -----"+userId+" -----------")
      console.log(message)
      console.log("------------------------")
      // Send the message to the specific WebSocket connection
      ws?.send(JSON.stringify(message));
    }
  }
};

const sendMessageToClientsInRoom = (roomId: string, message: any, eventType: SOCKET_SERVER_EVENTS) => {
  if (roomsMap.has(roomId)) {
    const roomMap = roomsMap.get(roomId);
    roomMap?.forEach((ws, userId) => {
      console.log(userId)
      message.eventType = eventType
      ws?.send(JSON.stringify(message));
    });
  }
};




// Function to handle different WebSocket events
const handleWebSocketEvent = async (
  message: { data: any, eventType: SOCKET_CLIENT_EVENTS },
  request: AuthRequest,
  ws: WebSocket & { isAlive?: boolean },
  isBinary: boolean

) => {
  try {
    const eventType = message.eventType;
    let data = message.data;
    data.user = request.user;

    console.log("Event detected - ", eventType);
    let res: ResponseInterface;

    ws.on("close", () => {
      checkActivePlayerStatus(message, res)
    })


    switch (eventType) {
      // case rabbitMQConfig.CLIENT_MODE.SOCKET.EVENTS.JOIN_ROOM.toString():
      //   const res: ResponseInterface = await rabbitMQClientMode.produceToServer(
      //     JSON.stringify(message),
      //     rabbitMQConfig.CLIENT_MODE.SOCKET.QUEUES.REQUEST_QUEUES.GENERAL_REQUEST_SERVER.toString()
      //   );
      //   console.log(res);

      //   break;

      case SOCKET_CLIENT_EVENTS.JOIN_ROOM:

        // console.log("Joining room ---------")
        // console.log(JSON.stringify(message))
        // console.log("-------------------")
        // Check if the room exists in the roomsMap






        // res = await rabbitMQClientMode.produceToServer(
        //   JSON.stringify(message),
        //   rabbitMQConfig.CLIENT_MODE.SOCKET.QUEUES.REQUEST_QUEUES.GENERAL_REQUEST_SERVER.toString()
        // );

        let res: ResponseInterface = {
          data: {},
          status: 500
        }
        // // console.log(res);
        // if (res.status < 300) {

        const userId = message.data.user?.userId!;

        if (!roomsMap.has(message.data.roomId)) {
          roomsMap.set(message.data.roomId, new Map());
        }


        roomsMap.get(message.data.roomId)?.set(userId, ws);
        console.log("----- ", request.user?.emailId, "-------JOINED THE ROOM-------")
        // console.log(roomsMap.get(message.data.roomId))
        console.log("-----------------------------------")



        // Add the WebSocket connection to the map based on userId and roomId
        // roomsMap.get(res.data.roomId)?.set(userId, ws);
        const resData = {
          eventType: SOCKET_SERVER_EVENTS.JOINED_SUCCESS,
          data: { "roomData": roomsMap.get(message.data.roomId) }
        }
        ws.send(JSON.stringify(resData))

        await checkActivePlayerStatus(message, res);



        // }
        break;


      case SOCKET_CLIENT_EVENTS.LEAVE_ROOM:
        try {
          // Perform the necessary logic for leaving the room

          // const res = await rabbitMQClientMode.produceToServer(
          //   JSON.stringify(message),
          //   rabbitMQConfig.CLIENT_MODE.SOCKET.QUEUES.REQUEST_QUEUES.GENERAL_REQUEST_SERVER.toString()
          // );
          let res: ResponseInterface = {
            data: {},
            status: 500
          }
          // if (res.status < 300) {

          // Remove the user's connection from the roomsMap of that room
          const roomId = message.data.roomId;
          if (roomsMap.has(roomId)) {
            const roomMap = roomsMap.get(roomId);
            const userId = message.data.user.userId;
            roomMap?.delete(userId);
            console.log("UserID ", userId, " left room ", roomId)
          }

          console.log("----- ", request.user?.emailId, "------LEFT THE ROOM-------")
          // console.log(roomsMap.get(message.data.roomId))
          console.log("-----------------------------------")
          const resData = {
            eventType: SOCKET_SERVER_EVENTS.LEAVE_SUCCESS,
            data: {},
          };

          // Notify the user about successful leave
          ws.send(JSON.stringify(resData));

          checkActivePlayerStatus(message, res);



          // }
        } catch (error) {
          console.log("Error handling LEAVE_ROOM event:", error);
        }
        break;

      // Add more cases for other events
      case SOCKET_CLIENT_EVENTS.PLAY_MOVE:

        try {
          const res = await rabbitMQClientMode.produceToServer(
            JSON.stringify(message),
            rabbitMQConfig.CLIENT_MODE.SOCKET.QUEUES.REQUEST_QUEUES.GENERAL_REQUEST_SERVER.toString()
          );

          if (res.status < 300) {
            sendMessageToClientsInRoom(message.data.roomId, res, SOCKET_SERVER_EVENTS.LATEST_GAME_STATUS);
          }
        } catch (error) {

          console.log("Error playing move by ", message.data.user.userId, " - ", error)
        }


        console.log("Play Move EVENT DATA - ", data);
        break;

      case SOCKET_CLIENT_EVENTS.GET_LATEST_GAME:

        try {
          const res = await rabbitMQClientMode.produceToServer(
            JSON.stringify(message),
            rabbitMQConfig.CLIENT_MODE.SOCKET.QUEUES.REQUEST_QUEUES.GENERAL_REQUEST_SERVER.toString()
          );

          sendMessageToClient(request.user?.userId!, res.data.roomId, res, SOCKET_SERVER_EVENTS.LATEST_GAME_STATUS)
        } catch (error) {
          console.log("Error getting latest game state " + error)
        }
        break;
      default:
        // Handle unknown or unsupported events
        console.log("Unsupported event type:", eventType);
    }
  } catch (error) {
    console.log("Error handling events ", error);
    // destroySocket(socket);
  }
};
