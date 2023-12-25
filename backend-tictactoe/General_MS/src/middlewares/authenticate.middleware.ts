import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import rabbitMQClientMode from "@/services/client/rabbitMQClientMode";
import { AuthRequest } from "@/types/AuthRequest.Interface";
import { Cookies } from "@/types/Cookies.enum";
import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import { NextFunction, Response } from "express";

export const authenticate  = async(req:AuthRequest, res:Response, next:NextFunction)=>{
    if(req.signedCookies[Cookies.ACCESSTOKEN] || req.signedCookies[Cookies.REFRESHTOKEN]){
        const tokens = {
            
                [Cookies.ACCESSTOKEN]:req.signedCookies[Cookies.ACCESSTOKEN],
                [Cookies.REFRESHTOKEN]:req.signedCookies[Cookies.REFRESHTOKEN]
            
        }
        const tokensData = {
            "tokens":tokens
        }
        console.log("Before sending tokens ",tokensData)
        const getAuthResponse:ServiceResponseInterface = await rabbitMQClientMode.produceToServer({eventType:rabbitMQConfig.CLIENT_MODE.GENERAL.EVENTS.GET_AUTH.toString(),data:tokensData},rabbitMQConfig.CLIENT_MODE.GENERAL.QUEUES.REQUEST_QUEUES.AUTH_REQUEST_SERVER.toString());
        if(getAuthResponse.status <= 300 ){
            req.user = getAuthResponse.data.user;
            next();

        }else{
        return res.status(getAuthResponse.status).json(getAuthResponse.data)

        }
    }else{
        return res.status(400).json("Missing Credentials ")
    }
    
    
}