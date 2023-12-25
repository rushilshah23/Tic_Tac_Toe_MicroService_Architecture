import { RoomInterface } from "@/types/Room.Interface";
import { WithId } from "mongodb";

export const docToRoomInterface = (roomDoc: any): RoomInterface => {
  
try {
    
    const room  :RoomInterface = {
        boardStatus: roomDoc.boardStatus,
        createdBy: roomDoc.createdBy,
        currentTurn: roomDoc.currentTurn,
        gameStatus: roomDoc.gameStatus,
        information: roomDoc.information,
        isO: roomDoc.isO,
        isX: roomDoc.isX,
        participants: roomDoc.participants,
        roomId: roomDoc.roomId
    }
    
    return room;
} catch (error) {
    throw Error("Failed to serialize MongoDoc to Room Interface ---- "+error);
}


}