"use client";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import Room from "./Room/Room";
import { userAPICalls } from "@/apiCalls/users";
import { useRouter } from "next/navigation";
import useAuthHook from "@/contextAPI/hooks/useAuthHook";
import CreateRoom from "./CreateRoom/CreateRoom";
import styles from "./Rooms.module.css";
import JoinRoom from "./JoinRoom/JoinRoom";
import { useRooms } from "@/contextAPI/hooks/useRooms";
interface RoomsProps {}

const Rooms: FC<RoomsProps> = () => {
  const { authState ,logout} = useAuthHook();
  // const [rooms, setRooms] = useState<string[] | null>(null);
    const {rooms,getUserRooms} = useRooms()
  const router = useRouter();

  const renderCount = useRef(0);

  useEffect(() => {
    let subscribed = true;
    if (subscribed) {
      // const getUserRooms = async () => {
      //   try {
      //     const userRoomsResponse = await userAPICalls.fetchUsersRooms();
      //     setRooms((prev) => {
      //       return userRoomsResponse.data.rooms;
      //     });
      //   } catch (error) {
      //     // If user is not authenticated, redirect to the login page
      //     console.log(error);
      //   }
      // };
      if (authState.user && rooms === null) {
        getUserRooms();
        renderCount.current = renderCount.current + 1;
        console.log("Render count for Room.tsx - ", renderCount);
        // console.log("Auth User is ",authState.user)
        // console.log("Rooms are ",rooms)
      }
    }
    return () => {
      subscribed = false;
    };
  }, [authState.user]);

  if (!authState.user || rooms === null) {
    // If user data is not yet fetched, show a loading state or spinner
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      {authState.user ? (
        <Fragment>
          <div className={styles.emailIdContainer}>
            <h2
              className={styles.emailId}
            >{`${authState.user.emailId}'s Room `}</h2>
            <button className={styles.logoutBtn} onClick={logout}>
                  LOGOUT
            </button>
          </div>
          <div className={styles.container}>
            <div className={styles.leftContainer}>
              <div className={styles.roomContainer}>
                {rooms && rooms.length > 0 ? (
                  rooms.map((room) => <Room key={room} roomId={room} />)
                ) : (
                  <p>No Rooms for the user</p>
                )}
              </div>
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.creatRoomContainer}>
              <CreateRoom />

              </div>
              <div className={styles.joinRoomContainer}>
              <JoinRoom />

              </div>
            </div>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default Rooms;
