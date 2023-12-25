"use client"

import { BoardType } from "@/types/UserMove.Interface";
import { createContext, useContext } from "react"


export interface ParticipantInterface {
    userId:string;
    isActive:boolean;
}


export interface RoomInterface{
        roomId:string,
        participants:ParticipantInterface[],
        createdBy:string,
        isX:string,
        isO:string,
        currentTurn:string,
        boardStatus:BoardType
        gameStatus:{
          won:string | null
          lose:string | null,
          drawn:boolean | null,
          triggerStatus:"STARTED" | "ENDED" | "ONGOING"
        }
    
}


const GameStateContext = createContext<RoomInterface| null>(null);


export const useGameStateContext = () =>{
    const context = useContext(GameStateContext);

    if(!context){
        throw Error("Game State Context not found !")
    }
}
