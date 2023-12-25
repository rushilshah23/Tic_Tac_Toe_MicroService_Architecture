

import { UserInterface } from "@/types/User.Interface";
import mongoDBInstance from "@/models/mongo";
import { v4 } from "uuid";
import { ParticipantInterface, RoomInterface, initBoardStatus } from "@/types/Room.Interface";
import { UpdateResult, WithId } from "mongodb";

class GameDB {
    private static async getCollection() {
        const dbConnection = await mongoDBInstance.getDB();
        return dbConnection.collection("rooms");
    }

    static createRoom = async (userId: string) => {
        const roomsCollection = await GameDB.getCollection();
        const roomInit: RoomInterface = {
            roomId: v4(),
            participants: [{ "userId": userId, "isActive": false }],
            createdBy: userId,
            boardStatus:initBoardStatus,
            currentTurn:userId,
            gameStatus:{
                drawn:null,
                lose:null,
                triggerStatus:"ONGOING",
                won:null
            },
            isO:null,
            isX:userId,
            information:"Current Turn "+userId  

        }
        const newRoomDoc = await roomsCollection.insertOne(roomInit);
        console.log("Room created - ", newRoomDoc)
        return newRoomDoc
    };



    static addUserToRoom = async (userId: string, roomId: string) => {
        try {
            const roomsCollection = await GameDB.getCollection();
            const room = await GameDB.getRoom(roomId);

            if (!room) {
                console.log("Room not found");
                return null;
            }

            const participants: ParticipantInterface[] = room.participants || [];

            const participantIds = participants.map((participant) => participant.userId);

            if (participantIds.includes(userId)) {
                console.log("The user is already admitted in the room");
                return null;
            }

            if (participants.length >= 2) {
                console.log("Room is already full");
                return null;
            }

            // Add the user to the participants array
            participants.push({ userId: userId, isActive: false });

            // Update the room with the new participants array
            const updateResult = await roomsCollection.updateOne(
                { roomId: roomId },
                { $set: { participants: participants,isO:userId } }
            );

            if (updateResult.modifiedCount > 0) {
                console.log(`User ${userId} added to room ${roomId}`);
                return room; // Return the updated room document if needed
            } else {
                console.log("Failed to add user to the room");
                return null;
            }
        } catch (error) {
            console.error("Failed to add user in the room:", error);
            throw new Error("Failed to add user in the room");
        }
    };

    static getRoom = async (roomId: string) => {
        const roomsCollection = await GameDB.getCollection();
        try {
            const roomDoc = await roomsCollection.findOne({ roomId: roomId })
            return roomDoc;

        } catch (error) {
            throw new Error(`Error retrieving room from database: ${error}`);

        }
    }

     static async updateRoom(room: RoomInterface): Promise<UpdateResult | null> {
        const roomsCollection = await GameDB.getCollection();
      
        try {
          const { roomId, ...roomWithoutId } = room;
      
          const updateResult = await roomsCollection.updateOne(
            { roomId: roomId },
            { $set: roomWithoutId }
          );
      
          return updateResult;
        } catch (error) {
          console.error('Error updating room:', error);
          return null;
        }
      }

      static async getUserAllRooms(userId: string): Promise<string[] | null> {
        try {
          const roomsCollection = await GameDB.getCollection();
      
          // Find rooms where the user is a participant
          const userRoomsCursor = await roomsCollection.find({ "participants.userId": userId });
      
          // Convert cursor to array of rooms
          const userRooms: any = await userRoomsCursor.toArray();
      
          // Extract room IDs from the fetched rooms
          const roomIds: string[] = userRooms.map((room: RoomInterface) => room.roomId);
      
          return roomIds;
        } catch (error) {
          console.error('Error fetching user rooms:', error);
          return null;
        }
      }
      
      

}

export { GameDB };
