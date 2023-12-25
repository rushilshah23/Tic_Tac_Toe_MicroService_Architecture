"use client"
import { userAPICalls } from '@/apiCalls/users'
import { FC, useState } from 'react'
import styles from "./CreateRoom.module.css"
import { useRooms } from '@/contextAPI/hooks/useRooms'
interface CreateRoomProps {
  
}

const CreateRoom: FC<CreateRoomProps> = ({}) => {
const [mssg,setMssg] = useState<string|null>(null);
const {getUserRooms} =useRooms()
const handleCreateRoomButton = async(e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    const res = await userAPICalls.createRoom();
    setMssg(res.message);
    await getUserRooms()
}
  return (
    <>
    <div className={styles.container}>

    <button className={styles.btn} onClick={handleCreateRoomButton}>
        Create a new room 
    </button>
    {mssg && <h3 className={styles.message}>{mssg}</h3>}
    </div>
    </>
  )
}

export default CreateRoom