import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";
import { defaultServiceResponseInterfaceValue } from "@/configs/microService.config";
import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import { GameLogic } from "@/logic/game.logic";
import rabbitMQClientMode from "@/services/client/rabbitMQClientMode";
import { AuthRequest } from "@/types/AuthRequest.Interface";
import { Cookies } from "@/types/Cookies.enum";
import { ResponseInterface } from "@/types/Response.interface";
import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import { UserPublicInterface } from "@/types/UserPublic.Interface";
import { Request, Response } from "express";

export const createRoom = async (req: AuthRequest, res: Response) => {


    const authUser: UserPublicInterface = req.user!;

    const result: ResponseInterface = await GameLogic.createRoomLogic(authUser);
    console.log("Room Created ")
    return res.status(200).json(result);

}

export const addUserToRoom = async (req: AuthRequest, res: Response) => {
    const roomId = req.body.roomId;
    const authUser: UserPublicInterface = req.user!;

    const result: ResponseInterface = await GameLogic.addUserToRoomLogic(authUser, roomId);
    console.log("Room Created ")
    return res.status(200).json(result);

}

export const joinUserToRoom = async (req: AuthRequest, res: Response) => {
    const authUser: UserPublicInterface = req.user!;

    let joinUserToRoomLogicResponse: ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    if (!!req.body.roomId) {
        // joinUserToRoomLogicResponse = await GameLogic.joinRoomLogic(authUser, req.body.roomId);
        // return res.status(joinUserToRoomLogicResponse.status).json(joinUserToRoomLogicResponse.data)
        return res.status(HTTP_STATUS_CODES.HTTP_400_BAD_REQUEST).json("Needs to be requested via a authnticated socket Connection")

    } else {
        return res.status(HTTP_STATUS_CODES.HTTP_404_NOT_FOUND).json("Room Id not found");
    }




}


export const leaveUserFromRoom = async (req: AuthRequest, res: Response) => {
    const authUser: UserPublicInterface = req.user!;

    let joinUserToRoomLogicResponse: ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    if (!!req.body.roomId) {
        joinUserToRoomLogicResponse = await GameLogic.leaveRoomlogic(authUser, req.body.roomId);
        return res.status(joinUserToRoomLogicResponse.status).json(joinUserToRoomLogicResponse.data)
    } else {
        return res.status(HTTP_STATUS_CODES.HTTP_404_NOT_FOUND).json("Room Id not found");
    }
}


export const getUserAllRooms = async (req: AuthRequest, res: Response) => {
    const authUser: UserPublicInterface = req.user!;

    const getUserAllRoomsResponse = await GameLogic.getUserAllRooms(authUser.userId);
    return res.status(getUserAllRoomsResponse.status).json(getUserAllRoomsResponse.data)
}


export const userInValidRoom  =async (req:AuthRequest, res:Response) =>{
    if(!!req.body.roomId){

        const authUser:UserPublicInterface = req.user!;
        const userInValidRoomResponse:ServiceResponseInterface = await GameLogic.userInValidRoom(req.body.roomId,authUser.userId);
        return res.status(userInValidRoomResponse.status)
        .json(userInValidRoomResponse.data);
    }else{
        return res.status(HTTP_STATUS_CODES.HTTP_404_NOT_FOUND).json("RoomId not provided")
    }

}

