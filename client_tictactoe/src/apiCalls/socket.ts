import { SOCKET_CLIENT_EVENTS, SOCKET_SERVER_EVENTS } from "@/configs/socket.config";
import { SocketData } from "@/types/SocketData.Interface";



class SocketGameAPI{




public  sendData =  (socket:WebSocket,eventType: SOCKET_CLIENT_EVENTS , data: any) => {
    try {
      if (socket) {
        // Create a message object with an event type and data
        const message:SocketData<SOCKET_CLIENT_EVENTS> = {
          eventType: eventType,
          data: data,
        };
        // Send the message to the server
        socket.send(JSON.stringify(message));
         console.log("Data sent from Socket API Function")
      } else {
        console.log("WebSocket connection is not open.");
      }
    } catch (error) {
      console.log("Failed to send data",error);
    }
  };


  public    receiveData = (socket:WebSocket,eventType: SOCKET_SERVER_EVENTS, data: any) => {
    try {
      if (socket) {
        // Create a message object with an event type and data
        const message:SocketData<SOCKET_SERVER_EVENTS> = {
          eventType: eventType,
          data: data,
        };

        // Send the message to the server
        socket.send(JSON.stringify(message));
        console.log(`Message received with event type ${eventType}:`, data);
      } else {
        console.log("WebSocket connection is not open.");
      }
    } catch (error) {
      console.log("Failed to receive data");
    }
  };


}

const socketGameAPI = new SocketGameAPI()

export {
  socketGameAPI
}