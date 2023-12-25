import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";
import { defaultServiceResponseInterfaceValue } from "@/configs/microService.config";
import { docToRoomInterface } from "@/lib/serializer";
import { GameDB } from "@/models/game";
import { ResponseInterface } from "@/types/Response.interface";
import { ParticipantInterface, PossibleCells, RoomInterface } from "@/types/Room.Interface";
import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import { UserPublicInterface } from "@/types/UserPublic.Interface";


class GameLogic {

  public static createRoomLogic = async (user: UserPublicInterface) => {
    let res: ResponseInterface = defaultServiceResponseInterfaceValue;
    try {
      const newRoomDoc = await GameDB.createRoom(user.userId);
      res = {
        data: newRoomDoc,
        status: 200
      }
      console.log("Room created successfully ...")
    } catch (error) {
      res = {
        data: "Failed creating room",
        status: 500
      }
      console.log(error)
    }
    return res;

    // create Room with the provided user and also call the addUserToRoom function
  }

  public static roomExistsLogic = async (roomId: string): Promise<ServiceResponseInterface> => {
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    const room = await GameDB.getRoom(roomId);

    if (!room) {
      console.log("Room does not exists");
      res = {
        data: "Room does not exists",
        status: HTTP_STATUS_CODES.HTTP_404_NOT_FOUND
      }
    } else {
      res = {
        data: room,
        status: HTTP_STATUS_CODES.HTTP_200_OK
      }
    }
    return res;
  }

  public static addUserToRoomLogic = async (user: UserPublicInterface, roomId: string) => {
    const roomExistsResp = await GameLogic.roomExistsLogic(roomId);


    let res = defaultServiceResponseInterfaceValue;
    if (roomExistsResp.status === HTTP_STATUS_CODES.HTTP_200_OK) {
      // Check eligibility that if the user is already in the room or max users are already present
      const respDoc = await GameDB.addUserToRoom(user.userId, roomId);

      if (!!!respDoc) {
        res = {
          data: "Can't add user in the room because it already exists or the Room is filled",
          status: HTTP_STATUS_CODES.HTTP_409_CONFLICT
        }
      } else {
        res = {
          data: respDoc,
          status: HTTP_STATUS_CODES.HTTP_200_OK
        }
      }
    } else {
      res = {
        data: roomExistsResp.data,
        status: roomExistsResp.status
      }
    }

    return res



    // Once joined room mark the participant in DB for that room as active
  }
  public static userExistsInRoom = async (user: UserPublicInterface, roomId: string) => {
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;

    const roomExistsResponse = await GameLogic.roomExistsLogic(roomId);
    if (roomExistsResponse.status !== HTTP_STATUS_CODES.HTTP_200_OK) {
      res = {
        data: roomExistsResponse.data,
        status: roomExistsResponse.status
      }
      return res;
    }
    const room: RoomInterface = roomExistsResponse.data;
    console.log("Room exists data ", room);
    const userExists = room.participants.some(participant => participant.userId === user.userId);
    console.log("User exists ", userExists);
    if (userExists) {
      res = {
        status: HTTP_STATUS_CODES.HTTP_200_OK,
        data: room
      };
    } else {
      res = {
        status: HTTP_STATUS_CODES.HTTP_404_NOT_FOUND,
        data: "User does not exist in the room"
      };
    }

    return res;


  }

  public static joinRoomLogic = async (user: UserPublicInterface, roomId: string, socketConnection: WebSocket & {
    isAlive?: boolean | undefined;
  }): Promise<ResponseInterface> => {
    let res: ResponseInterface = defaultServiceResponseInterfaceValue;

    const userInRoomResponse = await GameLogic.userExistsInRoom(user, roomId);

    if (userInRoomResponse.status === HTTP_STATUS_CODES.HTTP_200_OK) {
      const room: RoomInterface = userInRoomResponse.data;
      console.log("Printing room participants ", room.participants)
      if (room && Array.isArray(room.participants)) {
        const userIndex = room.participants.findIndex(participant => participant.userId === user.userId);

        if (userIndex !== -1) {
          if (room.participants[userIndex].isActive === false) {

            // Mark the user as active in the room
            room.participants[userIndex].isActive = true;

            // Update the room in the database (assuming a method to update room data)
            const updatedRoom = await GameDB.updateRoom(room);

            if (updatedRoom) {
              res = {
                data: {
                  userId: user.userId,
                  roomId: room.roomId,
                  message: `${user.emailId} active in ${room.roomId}`
                },
                status: HTTP_STATUS_CODES.HTTP_200_OK
              };
            } else {
              res = {
                data: "Failed to update room data",
                status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
              };
            }
          } else {
            res = {
              data: `${user.emailId} is already active in the room.`,
              status: HTTP_STATUS_CODES.HTTP_200_OK
            };
          }
        } else {
          res = {
            data: `${user.emailId} exists in the room but is not properly registered.`,
            status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
          };
        }
      } else {
        res = {
          data: `Room or participants data is missing or invalid.`,
          status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
        };
      }
    } else {
      res = userInRoomResponse;
    }

    return res;
  };

  public static leaveRoomlogic = async (user: UserPublicInterface, roomId: string) => {
    let res: ResponseInterface = defaultServiceResponseInterfaceValue;

    const userInRoomResponse = await GameLogic.userExistsInRoom(user, roomId);

    if (userInRoomResponse.status === HTTP_STATUS_CODES.HTTP_200_OK) {
      const room: RoomInterface = userInRoomResponse.data;
      console.log("Printing room participants ", room.participants)
      if (room && Array.isArray(room.participants)) {
        const userIndex = room.participants.findIndex(participant => participant.userId === user.userId);

        if (userIndex !== -1) {
          if (room.participants[userIndex].isActive === true) {
            // Mark the user as active in the room
            room.participants[userIndex].isActive = false;

            // Update the room in the database (assuming a method to update room data)
            const updatedRoom = await GameDB.updateRoom(room);

            if (updatedRoom) {
              res = {
                data: `${user.emailId} is now Inactive in the room.`,
                status: HTTP_STATUS_CODES.HTTP_200_OK
              };
            } else {
              res = {
                data: "Failed to update room data",
                status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
              };
            }
          } else {
            res = {
              data: `${user.emailId} is  already Inactive active in the room.`,
              status: HTTP_STATUS_CODES.HTTP_200_OK
            };
          }
        } else {
          res = {
            data: `${user.emailId} exists in the room but is not properly registered.`,
            status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
          };
        }
      } else {
        res = {
          data: `Room or participants data is missing or invalid.`,
          status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
        };
      }
    } else {
      res = userInRoomResponse;
    }

    return res;
  };



  public static validateParticipantsLogic = async () => {
    // Validate if correct and the exact required users have joined the room means their status is active for that room
  }

  public static validateMoveLogic = async (): Promise<boolean> => {
    // Validate the current move recived with the past moves 
    // i.e The updated move is played by which player and is he authorized to play.
    // The move doesn't violate game rules like replacing existing filled blocks.
    return true;
  }


  public static updateGameMoveLogic = async (roomId: string, updatedMove: Object) => {
    // Update the existing gameMove with the latest updatedMove after validatingMove
  }
  public static getUserAllRooms = async (userId: string): Promise<ServiceResponseInterface> => {
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;

    const allUserRooms = await GameDB.getUserAllRooms(userId);

    if (!!allUserRooms) {
      res = {
        data: { rooms: allUserRooms },
        status: HTTP_STATUS_CODES.HTTP_200_OK
      }
    } else {
      res = {
        data: "Error finding Users Room",
        status: HTTP_STATUS_CODES.HTTP_404_NOT_FOUND
      }
    }
    return res;
  }

  public static userInValidRoom = async (roomId: string, userId: string) => {
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    try {
      // Logic to check if the room exists
      const room = await GameDB.getRoom(roomId); // Implement this method to retrieve the room by roomId

      if (!room) {
        res = {
          status: HTTP_STATUS_CODES.HTTP_404_NOT_FOUND, // Room not found status code
          data: 'Room not found',
        };
        return res;
      }

      // Check if the user is a participant in the room
      const participants: ParticipantInterface[] = room.participants || [];

      const isUserInRoom = participants.some((participant) => participant.userId === userId);

      if (!isUserInRoom) {
        res = {
          status: HTTP_STATUS_CODES.HTTP_403_FORBIDDEN, // Forbidden status code (user not in the room)
          data: 'User is not in the room',
        };
        return res;
      }

      // User is in the valid room
      res = {
        status: HTTP_STATUS_CODES.HTTP_200_OK, // Success status code
        data: 'User is in the valid room',
      };
      return res;
    } catch (error) {
      console.error('Error checking user in room:', error);
      res = {
        status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR, // Internal server error status code
        data: 'Internal server error',
      };
      return res;
    }
    return res;
  }

  public static validateBothPlayersActiveStatus = async (roomId: string): Promise<ServiceResponseInterface> => {
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    const roomData = await GameDB.getRoom(roomId);
    if (!roomData) {
      res = {
        status: HTTP_STATUS_CODES.HTTP_404_NOT_FOUND, // Room not found status code
        data: 'Room not found',
      };
      return res;
    }

    // Check if the user is a participant in the room
    const participants: ParticipantInterface[] = roomData.participants || [];
    let count = 0;

    participants.map((participant) => {
      if (participant.isActive) {
        count = count + 1;

      }
    })


    if (count === 2) {

      res = {
        status: HTTP_STATUS_CODES.HTTP_200_OK,
        data: {
          roomId: roomId,
          participants: participants
        }
      }
    } else {
      res = {
        status: HTTP_STATUS_CODES.HTTP_406_NOT_ACCEPTABLE,
        data: {
          roomId: roomId,
          participants: participants
        }
      }
    }

    return res;
  }
  public static validatePlayerMove = async (roomId: string, user: UserPublicInterface, selectedCell: PossibleCells): Promise<ServiceResponseInterface> => {
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;


    // 1. Player Authentication
    // 2. Player Trying to play on valid room
    // 3. Player Online
    // 4. Opponent Online
    // 5. If GAME_STATUS NOT STARTED THEN  first turn then assign X to the player else O and then update player X/O assignation in the DB
    // 6. If GAME_STATUS STARTED then check current Turn XO Code
    // 7. if current turn matches users's ID/ XO Code then check if the cell the player is attempting to play is empty.
    // 8. Update player move in DB

    try {
      // 1. Player Authentication
      // Add your player authentication logic here

      // 2. Get the room details
      const roomDoc = await GameDB.getRoom(roomId);

      if (!!roomDoc) {
        // let room : RoomInterface = {
        //   boardStatus:roomDoc.boardStatus,
        //   createdBy:roomDoc.createdBy,
        //   currentTurn:roomDoc.currentTurn,
        //   gameStatus:roomDoc.gameStatus,
        //   information:roomDoc.information,
        //   isO:roomDoc.isO,
        //   isX:roomDoc.isX,
        //   participants:roomDoc.participants,
        //   roomId:roomDoc.roomId
        // }

        let room:RoomInterface = docToRoomInterface(roomDoc);
        // 3. Check if it's the user's turn

        if(room.gameStatus.triggerStatus === "ENDED"){
          res = {
            data: {"message":"Game has already ended"},
            status: HTTP_STATUS_CODES.HTTP_406_NOT_ACCEPTABLE
          };
        }
        else  if (room.currentTurn === user.userId) {
          const boardStatus = room.boardStatus;

          // 4. Check if the selected cell is empty
          if (boardStatus[selectedCell] === null) {
            // 5. Update player move in the boardStatus
            let isX: boolean | null = null;
            if (room.isX === user.userId) {
              isX = true;
            } else if (room.isO === user.userId) {
              isX = false;
            } else {
              res = {
                data: { meessage: "User can't play since X / O is not assigned " },
                status: HTTP_STATUS_CODES.HTTP_403_FORBIDDEN
              }
            }
            if (isX !== null) {

              boardStatus[selectedCell] = isX ? 'X' : 'O';
              room.boardStatus = boardStatus;
              room.currentTurn = isX === true ? room.isO! : room.isX;
            }

            // Check if 'X' is the winner
            if (
              (boardStatus["1"] === "X" && boardStatus["2"] === "X" && boardStatus["3"] === "X") || // Row 1
              (boardStatus["4"] === "X" && boardStatus["5"] === "X" && boardStatus["6"] === "X") || // Row 2
              (boardStatus["7"] === "X" && boardStatus["8"] === "X" && boardStatus["9"] === "X") || // Row 3
              (boardStatus["1"] === "X" && boardStatus["4"] === "X" && boardStatus["7"] === "X") || // Column 1
              (boardStatus["2"] === "X" && boardStatus["5"] === "X" && boardStatus["8"] === "X") || // Column 2
              (boardStatus["3"] === "X" && boardStatus["6"] === "X" && boardStatus["9"] === "X") || // Column 3
              (boardStatus["1"] === "X" && boardStatus["5"] === "X" && boardStatus["9"] === "X") || // Diagonal 1
              (boardStatus["3"] === "X" && boardStatus["5"] === "X" && boardStatus["7"] === "X")    // Diagonal 2
            ) {
              // 'X' is the winner
              room.gameStatus.drawn = false;
              room.gameStatus.lose = isX === true ? room.isO : null;
              room.gameStatus.won = isX === true ? user.userId : null,
              room.gameStatus.triggerStatus = "ENDED"
              room.information = `${user.emailId} - (X) won the game !`

            }

            // Check if 'O' is the winner
            else if (
              (boardStatus["1"] === "O" && boardStatus["2"] === "O" && boardStatus["3"] === "O") || // Row 1
              (boardStatus["4"] === "O" && boardStatus["5"] === "O" && boardStatus["6"] === "O") || // Row 2
              (boardStatus["7"] === "O" && boardStatus["8"] === "O" && boardStatus["9"] === "O") || // Row 3
              (boardStatus["1"] === "O" && boardStatus["4"] === "O" && boardStatus["7"] === "O") || // Column 1
              (boardStatus["2"] === "O" && boardStatus["5"] === "O" && boardStatus["8"] === "O") || // Column 2
              (boardStatus["3"] === "O" && boardStatus["6"] === "O" && boardStatus["9"] === "O") || // Column 3
              (boardStatus["1"] === "O" && boardStatus["5"] === "O" && boardStatus["9"] === "O") || // Diagonal 1
              (boardStatus["3"] === "O" && boardStatus["5"] === "O" && boardStatus["7"] === "O")    // Diagonal 2
            ) {
              // 'O' is the winner
              room.gameStatus.drawn = false;
              room.gameStatus.lose = isX === false ? room.isX : null;
              room.gameStatus.won = isX === false ? user.userId : null,
                room.gameStatus.triggerStatus = "ENDED"
              room.information = `${user.emailId} - (O) won the game !`
            }
            else if (
              (boardStatus["1"] !== null && boardStatus["2"] !== null && boardStatus["3"] !== null && boardStatus["4"] !== null
                && boardStatus["5"] !== null && boardStatus["6"] !== null && boardStatus["7"] !== null && boardStatus["8"] !== null
                && boardStatus["9"] !== null
              )
            ) {
              room.gameStatus.drawn = true;
              room.gameStatus.lose = false;
              room.gameStatus.won = false,
              room.gameStatus.triggerStatus = "ENDED"
              room.information = `Game is tied  !`
            }else{
              room.information = "Current turn for user - "+room.currentTurn
            }
            // 6. Now calculate the W/L/D/Ongoing status

            // Logic to calculate game status, winner, loser, or draw

            // 7. Get and send the latest game info
            // const gameInfo = {
            //   roomId: roomId,
            //   participants: room.participants,
            //   createdBy: room.createdBy,
            //   isX: room.isX,
            //   isO: room.isO,
            //   currentTurn: room.currentTurn,
            //   boardStatus: room.boardStatus,
            //   game_status: {
            //     WON: /* Logic to determine the winner */,
            //     LOSE: /* Logic to determine the loser */,
            //     Drawn: /* Logic to determine if the game is drawn */,
            //     SE_Status: /* Logic to determine if the game is ongoing, ended, etc. */
            //   }
            // };
            // Update room in the DB (Assuming GameDB.updateRoom is available)
            const gameInfo  = await GameDB.updateRoom(room);

            if(!!gameInfo){
              
              const latstGameInfoDoc = await GameDB.getRoom(roomId)
              const latstGameInfo = docToRoomInterface(latstGameInfoDoc);
              res = {
                data: latstGameInfo,
                status: HTTP_STATUS_CODES.HTTP_200_OK
              };
            }else{
              res = {
                data: {message:"Some thing went wrong updating game state"},
                status: HTTP_STATUS_CODES.HTTP_417_EXPECTATION_FAILED
              };
            }
          } else {
            res = {
              data: { message: "Cell already occupied" },
              status: HTTP_STATUS_CODES.HTTP_409_CONFLICT
            };
          }
        } else {
          res = {
            data: { message: "Not your turn" },
            status: HTTP_STATUS_CODES.HTTP_406_NOT_ACCEPTABLE
          };
        }
      } else {
        res = {
          data: { message: "Room not found" },
          status: HTTP_STATUS_CODES.HTTP_404_NOT_FOUND
        };
      }
    } catch (error) {
      console.error("Error in validatePlayerMove:", error);
      res = {
        data: { message: "An error occurred while validating player move" },
        status: HTTP_STATUS_CODES.HTTP_504_GATEWAY_TIMEOUT
      };
    }


    // 9. Now calculate the W/L/D/Ongoing status/
    // 10. If W/L/D then set GAME_STATUS_1 TO ENDED

    // 11. Get and send the latest game Info =>
    // {
    //     roomId:string,
    //     participants:Participants[],
    //     createdBy:string,
    //     isX:string,
    //     isO:string,
    //     currentTurn:string,
    //     boardStatus:{
    //       1:X,
    //       2:null,
    //       3.O
    //       ...
    //     },
    //     game_status:{
    //       WON:string | null
    //       LOSE:string | null,
    //       Drawn:boolean | null,
    //       SE_Status:GAME_STARTED | GAME_ENDED | GAME_ONGOING
    //     }
    // }

    return res;
  }

  public static getLatestRoomStatus = async(roomId: string): Promise<ResponseInterface> => {
    let res = defaultServiceResponseInterfaceValue;
    const latstGameInfoDoc = await GameDB.getRoom(roomId)
              const latstGameInfo = docToRoomInterface(latstGameInfoDoc);
              res = {
                data: latstGameInfo,
                status: HTTP_STATUS_CODES.HTTP_200_OK
              };
              return res
  }
}




export { GameLogic }