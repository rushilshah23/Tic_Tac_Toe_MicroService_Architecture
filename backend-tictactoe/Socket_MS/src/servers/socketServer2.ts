// import express, { Request } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import WebSocket from 'ws';
// import bodyParser from "body-parser";
// import { AuthRequest } from "@/types/AuthRequest.Interface";
// import {   ENV_VAR as config } from "@/configs/env.config";
// import helmet from "helmet"
// import { Socket } from "net";
// import { SOCKET_GAME_EVENTS } from "@/configs/socket.config";



// import { Cookies } from "@/types/Cookies.enum";
// import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
// import { CORS_OPTIONS } from "@/configs/cors.config";
// import rabbitMQClientMode from "@/services/client/rabbitMQClientMode"
// import { initializeRabbitMQ } from "@/services/serviceInit";
// // import { getAuthMiddleware } from "@/middlewares/getAuth";
// import { parseCookies } from "@/lib/cookies";



// const socketApp = express();

// socketApp.use(cors(CORS_OPTIONS));

// socketApp.use(cookieParser(config.COOKIE_PARSER_SECRET));
// socketApp.use(express.json());
// socketApp.use(helmet());
// socketApp.use(bodyParser.json());
// socketApp.use(bodyParser.urlencoded({ extended: true }));

// // socketApp.use(getAuthMiddleware);


// const socket_port = Number(config.SOCKET_PORT);







// const socketServer = socketApp.listen(socket_port, async () => {
//   console.log(`WebSocket server running at ws://localhost:${socket_port}`);
//   await initializeRabbitMQ()
// });

// // const authPublishService = new AuthPublisher();

// const wss = new WebSocket.Server({ server: socketServer });

// // WebSocket connection established
// wss.on('connection', async (socket: Socket, request: AuthRequest) => {

//   if(request.headers.cookie){

//     const cookies  =  parseCookies(request.headers.cookie?.toString());
//   }
//   // console.log(request.headers.cookie)
//   console.log("Request signed cookies are - ",request.signedCookies)

//   // if(!request.signedCookies[Cookies.ACCESSTOKEN] && !request.signedCookies[Cookies.REFRESHTOKEN]){
//   //   console.log("No valid credntials to authenticate !");
//   //   socket.emit("close");
//   // }



//   const tokens = {    
//     "access":request.signedCookies[Cookies.ACCESSTOKEN],
//     "refresh":request.signedCookies[Cookies.REFRESHTOKEN]
//   }

//   // const tokens = {
//   //   "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6IjY4MjNiZjkyLWJiNmEtNDlhMi1iZGNjLTFjZjUzMmYyNzQwOCIsImVtYWlsSWQiOiJhMUBnbWFpbC5jb20ifSwiaWF0IjoxNjk5OTEwNTkwLCJleHAiOjE2OTk5MTA2NTB9.D-P2OR17l53RMqGsde7R4AIYwRWrIRLdieNW0fKaJbg",
//   //   "refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6IjY4MjNiZjkyLWJiNmEtNDlhMi1iZGNjLTFjZjUzMmYyNzQwOCIsImVtYWlsSWQiOiJhMUBnbWFpbC5jb20ifSwidmVyc2lvbklkIjoxLCJpYXQiOjE2OTk5MTA1OTAsImV4cCI6MTY5OTkxMDc3MH0._7Cn6ef7uH5cRJFsjp2T9h34fArcoYCMHTMreZ4oMR0"
//   // }


//   const respo = await rabbitMQClientMode.produceToServer({ eventType: rabbitMQConfig.CLIENT_MODE.SOCKET.EVENTS.GET_AUTH, data: { tokens: tokens } }, rabbitMQConfig.CLIENT_MODE.SOCKET.QUEUES.REQUEST_QUEUES.AUTH_REQUEST_SERVER.toString());

//   console.log(respo);




//   if (!request.user?.emailId) {
//     console.log("User not authenticated !");
//     socket.emit("close");
//   } else {



//     console.log("Client connected: ", request.user?.emailId);

//     // Handle messages received from the client
//     socket.on('message', (data: any) => {
//       console.log("Message by: ", request.user?.emailId);
//       const message = JSON.parse(data);
//       // Determine the event type and handle it
//       handleWebSocketEvent(message, request, socket);
//     });

//     // Handle WebSocket connection closure
//     socket.on('close', () => {
//       console.log('Client disconnected:', request.user?.emailId);
//     });
//   }
// });

// wss.on("close", () => {
//   console.log("WebSocket server connection closed");
// });


// // function onSocketError(err:any){
// //   console.log(err);
// // }



// // // Upgrade the HTTP server to support WebSocket connections
// // try {
// // socketServer.on('upgrade', async (request: AuthRequest, socket: Socket, head: any) => {
// //   console.log("HTTPS protocol upgrading started...");

// //   // socket.on('error', onSocketError);

// //   authenticateMW_WS(request, socket, () => {
// //     console.log("Socket Successfully authenticated!");
// //     // socket.removeListener('error', onSocketError);
// //     wss.handleUpgrade(request, socket, head, async (ws) => {
// //       wss.emit('connection', ws, request);
// //     });
// //   });
// // });
// // } catch (error) {
// //     console.log("Socket handling error:- ",error);
// // }

// // Function to handle different WebSocket events
// function handleWebSocketEvent(message: any, request: AuthRequest, socket: Socket) {
//   console.log("Handling and detecting eventType")
//   const eventType = message.eventType;
//   const data = message.data;
//   console.log(eventType);
//   console.log(data)

//   switch (eventType) {
//     case SOCKET_GAME_EVENTS.START_GAME:

//       console.log("Event Type - " + eventType);
//       console.log("Game started")


//       //   startGame(request,socket,data);
//       // Handle the "start-game" event
//       // You can access the data and request information as needed
//       break;

//     case "join-room":
//       console.log("Joined room")
//       // Handle the "join-room" event
//       // You can access the data and request information as needed
//       break;

//     case "leave-room":
//       // Handle the "leave-room" event
//       // You can access the data and request information as needed
//       break;

//     // Add more cases for other events

//     default:
//       // Handle unknown or unsupported events
//       console.log("Unsupported event type:", eventType);
//   }
// }
