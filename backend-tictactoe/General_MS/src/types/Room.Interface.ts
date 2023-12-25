export interface ParticipantInterface {
    userId:string;
    isActive:boolean
}



export interface UserMove{selectedCell:PossibleCells,roomId:string}

export type PossibleCells = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type PossibleValues = "X" | "O" | null;

export type BoardType = {
  [key in PossibleCells]: PossibleValues | null;
};


export interface RoomInterface{
    roomId:string,
    participants:ParticipantInterface[],
    createdBy:string,
    isX:string,
    isO:string | null,
    currentTurn:string,
    boardStatus:BoardType
    gameStatus:{
      won:string | null | false,
      lose:string | null | false,
      drawn:boolean | null,
      triggerStatus: "ENDED" | "ONGOING" 
    },
    information:string|null

}

export const initBoardStatus: BoardType = {
    "1":null,
    "2":null,
    "3":null,
    "4":null,
    "5":null,
    "6":null,
    "7":null,
    "8":null,
    "9":null
}