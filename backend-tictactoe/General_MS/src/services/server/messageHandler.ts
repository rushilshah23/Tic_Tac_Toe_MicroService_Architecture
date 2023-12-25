import { ConsumeMessage } from "amqplib";
import rabbitMqServerInstance from "@/services/server/rabbitMQServerMode"
import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import { GameLogic } from "@/logic/game.logic";
import { ResponseInterface } from "@/types/Response.interface";
import { SOCKET_CLIENT_EVENTS, SOCKET_MICROSERVICE_EVENTS, SOCKET_SERVER_EVENTS } from "@/configs/socket.config";
import { defaultServiceResponseInterfaceValue } from "@/configs/microService.config";
import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";


export default class MessageHandler {


    public async handle(message: ConsumeMessage) {
        const { replyTo, correlationId } = message.properties;

        const parsedData = JSON.parse(message.content.toString());
        const { eventType, data } = parsedData;




        let res: ResponseInterface = defaultServiceResponseInterfaceValue;
        switch (JSON.parse(parsedData).eventType) {

            // case rabbitMQConfig.SERVER_MODE.GENERAL.EVENTS.JOIN_ROOM.toString():
            case SOCKET_CLIENT_EVENTS.JOIN_ROOM:

                try {
                    const roomId = JSON.parse(parsedData).data.roomId;
                    const socket = JSON.parse(parsedData).data.socket
                    console.log(roomId)
                    const user = JSON.parse(parsedData).data.user
                    console.log(user)

                    res = await GameLogic.joinRoomLogic(user, roomId, socket);
                    // if(res.status <= 300){
                    //     res = await GameLogic.validateBothPlayersActiveStatus(roomId)

                    //     if(res.status === HTTP_STATUS_CODES.HTTP_200_OK){

                    //         // Produce the response 
                    //         await rabbitMqServerInstance.produceToClient(res, correlationId, replyTo);
                    //         console.log("After checking Both active status ", res)
                    //     }

                    // }


                } catch (error) {
                    console.log("JSON parsing error - ", error)
                }
                break;

            case SOCKET_MICROSERVICE_EVENTS.GET_ROOM_PLAYER_STATUS:
                try {
                    const roomId = JSON.parse(parsedData).data.roomId;

                    res = await GameLogic.validateBothPlayersActiveStatus(roomId)

                    // if (res.status === HTTP_STATUS_CODES.HTTP_200_OK) {

                        // Produce the response 
                        await rabbitMqServerInstance.produceToClient(res, correlationId, replyTo);
                        console.log("After checking Both active status ", res)
                    // }


                } catch (error) {
                    console.log("JSON parsing error - ", error)
                }
                break;
            case SOCKET_CLIENT_EVENTS.LEAVE_ROOM:

                try {
                    const roomId = JSON.parse(parsedData).data.roomId;
                    console.log(roomId)
                    const user = JSON.parse(parsedData).data.user
                    console.log(user)

                    res = await GameLogic.leaveRoomlogic(user, roomId);



                } catch (error) {
                    console.log("JSON parsing error - ", error)
                }
                break;
                case SOCKET_CLIENT_EVENTS.PLAY_MOVE:
                try {
                    const roomId = JSON.parse(parsedData).data.roomId;
                    const user = JSON.parse(parsedData).data.user;
                    const selectedCell = JSON.parse(parsedData).data.selectedCell;

                    res = await GameLogic.validatePlayerMove(roomId,user,selectedCell)
                } catch (error) {
                    res= {
                        data:{message:"Error playing user move"},
                        status:HTTP_STATUS_CODES.HTTP_417_EXPECTATION_FAILED
                    }
                }

                break;

                case SOCKET_CLIENT_EVENTS.GET_LATEST_GAME:
                try {
                    const roomId = JSON.parse(parsedData).data.roomId;
                    res = await GameLogic.getLatestRoomStatus(roomId)
                } catch (error) {
                    console.log(error)
                }
                break;
            // case rabbitMQConfig.SERVER_MODE.GENERAL.EVENTS.VALIDATE_MOVE.toString():
            //     res = await GameLogic.validateMove() 

            //     break;
            // case rabbitMQConfig.SERVER_MODE.GENERAL.EVENTS.UPDATE_GAME.toString():
            //     res = await GameLogic.updateGameMove(data.roomId, data.gameStatus) 
            //         break;
            default:
                res = { data: {}, status: 0 };
                // Produce the response 

                break;
        }

        // Produce the response 
        await rabbitMqServerInstance.produceToClient(res, correlationId, replyTo);


    }
}