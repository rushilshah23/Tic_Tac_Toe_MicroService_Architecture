"use client";

import { userAPICalls } from "@/apiCalls/users";
import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const RoomsContext = createContext<string[] | null>(null);

 const useRoomsContext = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw Error("Room context not defined ");
  }

  return context;
};

const RoomsActionContext = createContext<
  Dispatch<SetStateAction<string[] | null>>
>(() => null);


 const useRoomsActionContext = () => {
  const context = useContext(RoomsActionContext);
  if (!context) {
    throw Error("Room Action context not defined ");
  }

  return context;
};

type RoomsProviderProps = {
  children: React.ReactNode;
};

export const RoomsProvider: React.FC<RoomsProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<string[] | null>([]);
  return (
    <RoomsContext.Provider value={rooms}>
      <RoomsActionContext.Provider value={setRooms}>
        {children}
      </RoomsActionContext.Provider>
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const rooms = useRoomsContext();
  const setRooms = useRoomsActionContext();
  const getUserRooms = async () => {
    try {
      const userRoomsResponse = await userAPICalls.fetchUsersRooms();
      setRooms((prev) => {
        return userRoomsResponse.data.rooms;
      });
      console.log("Rooms fetched as ",rooms)
    } catch (error) {
      // If user is not authenticated, redirect to the login page
      console.log(error);
    }
  };



    useEffect(()=>{
        let subscribed = true;
        if(subscribed){

            const getRooms = async()=>{
                await getUserRooms();
            }

        getRooms()

    }
        return ()=>{
            // setRooms([]);
            subscribed = false
        }
    },[])
  return { rooms, getUserRooms };
};
