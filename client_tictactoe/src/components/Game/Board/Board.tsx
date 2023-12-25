import { FC, Fragment, useContext, useEffect, useRef, useState } from "react";
import styles from "./Board.module.css";
import { PossibleCells, UserMove } from "@/types/UserMove.Interface";
import { WebSocketExt } from "@/types/WebSocketExt";
import { RoomInterface } from "@/types/Room.Interface";
interface BoardProps {
  roomId: string;
  socketConnection: WebSocketExt;
  sendMove: (data: UserMove) => Promise<any>;
  game:RoomInterface
}

const Board: FC<BoardProps> = ({ roomId, socketConnection, sendMove, game }) => {
  // const {sendMove,socketGameContext} = useSocketGameUtilHook();
  // const socketGameContext = useContext(SocketGameContext);
  // const {socketConnection,sendMove  } = useSocket(roomId)
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  console.log("Render count for Board.tsx - ", renderCount);

  const handleSelectCell = async (
    e: React.MouseEvent<HTMLButtonElement>,
    cellNo: PossibleCells
  ) => {
    e.preventDefault();
    // HERE socketGameContext.roomId is displayed null despite being setup at the start of the socket server in GameWrapper.tsx
    if (!!socketConnection) {
      const data: UserMove = {
        roomId: roomId,
        selectedCell: cellNo,
      };

      await sendMove(data).then(() => {
        console.log("HANDLE CLICK FUNCTION TO COMPLETE AFTER SENDING");
      });
    }
  };

  const Cell: FC<{ cellNo: PossibleCells }> = ({ cellNo }) => {
    return (
      <button
        className={styles.cell}
        onClick={(e) => {
          handleSelectCell(e, cellNo);
        }}
      >
        <div className={styles.cellItem}>{game.boardStatus[cellNo] && game.boardStatus[cellNo]}</div>
      </button>
    );
  };
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.row}>
          <Cell cellNo={1} />
          <Cell cellNo={2} />
          <Cell cellNo={3} />
        </div>
        <div className={styles.row}>
          <Cell cellNo={4} />
          <Cell cellNo={5} />
          <Cell cellNo={6} />
        </div>
        <div className={styles.row}>
          <Cell cellNo={7} />
          <Cell cellNo={8} />
          <Cell cellNo={9} />
        </div>
      </div>
    </Fragment>
  );
};

export default Board;
