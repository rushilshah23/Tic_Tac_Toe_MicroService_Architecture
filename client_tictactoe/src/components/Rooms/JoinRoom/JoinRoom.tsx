"use client";

import { FC, useState } from 'react'
import styles from "./JoinRoom.module.css"
import { userAPICalls } from '@/apiCalls/users';
import { useRooms } from '@/contextAPI/hooks/useRooms';
interface JoinRoomProps {
  
}

const JoinRoom: FC<JoinRoomProps> = ({}) => {
    const [mssg,setMssg] = useState<string|null>(null)
    const [inputField,setInputField] = useState(" ");
    const { getUserRooms} =useRooms()

    const handleJoinRoom = async(e:React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault()
        setMssg(" ")
        if(inputField !== " "){

            const res = await userAPICalls.addUserToRoom(inputField)
            setMssg(res.message);
            getUserRooms()
        }else{
            setMssg("Please enter a roomId first !")
        }
    }
  return (
    <>
        <div className={styles.container}>
            <div className={styles.innerContainer}>

            <input type="text" className={styles.inputContainer} placeholder='Enter RoomId to join' onChange={(e)=>setInputField(e.target.value)}/>
            <button className={styles.btn} onClick={handleJoinRoom}>JOIN A ROOM</button>
            </div>
            <div className={styles.message}>
                {mssg && mssg}
            </div>
        </div>

    </>
  )
}

export default JoinRoom