import { useRouter } from 'next/navigation';
import { FC, Fragment } from 'react'
import styles from "./Room.module.css"
interface RoomProps {
  roomId:string;
}

const Room: FC<RoomProps> = ({roomId}) => {
    const router = useRouter();
    const handleJoinRoom = (e:React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        router.push(`/game?roomId=${roomId}`)

    }
  return (
    <Fragment>
      <div className={styles.container}>

        <h4 className={styles.roomId}>{roomId}</h4>
        <button className={styles.btn} onClick={handleJoinRoom}>Join Room</button>
      </div>
    </Fragment>
  )
}

export default Room