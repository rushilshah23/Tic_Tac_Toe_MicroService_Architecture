
export interface UserMove{selectedCell:PossibleCells,roomId:string}

export type PossibleCells = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type PossibleValues = "X" | "O" | null;

export type BoardType = {
  [key in PossibleCells]: PossibleValues | null;
};

