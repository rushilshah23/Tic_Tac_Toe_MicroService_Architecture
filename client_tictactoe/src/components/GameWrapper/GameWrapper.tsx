"use client";

import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import Game from "../Game/Game";
import { useRouter, useSearchParams } from "next/navigation";
import { userAPICalls } from "@/apiCalls/users";


import useAuthHook from "@/contextAPI/hooks/useAuthHook";


interface GameProps {}
// Imports remain unchanged

const GameWrapper: FC<GameProps> = () => {
  const { authState } = useAuthHook();
  const params = useSearchParams();
  const roomId = params.get("roomId");
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [inValidRoom, setInValidRoom] = useState(false);

  const renderCount = useRef(0);
  useEffect(() => {
    const checkRoomValidity = async () => {
      if (roomId) {
        const res = await userAPICalls.isUserInValidRoom(roomId);
        if (res.status < 300) {
          setInValidRoom(true);
          setIsValidating(false);
        } else {
          router.replace("/rooms");
        }
      } else {
        router.replace("/rooms");
      }
    };

    if (authState?.user && isValidating) {
      checkRoomValidity();
      renderCount.current = renderCount.current+1;
      console.log("Render count for GameWrapper.tsx - ",renderCount);
    }
  }, [authState, isValidating, roomId, router]);

  if (!authState || isValidating) {
    return <p>Authentication and Room Validation in Progress...</p>;
  }

  if (!inValidRoom) {
    return <p>Invalid room</p>;
  }

  if (roomId && authState.user && inValidRoom && !isValidating) {
    return (
      <Fragment>
        {/* <SocketGameProvider> */}

        <Game roomId={roomId} />
        {/* </SocketGameProvider> */}
      </Fragment>
    );
  }

  return null; // Or a fallback if none of the conditions are met
};

export default GameWrapper;
