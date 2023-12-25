// import { RoomsProvider } from "@/contextAPI/hooks/useRooms";
import { FC, Fragment } from "react";
import Rooms from "./Rooms";

interface RoomsWrappeerProps {}

const RoomsWrappeer: FC<RoomsWrappeerProps> = ({}) => {
  return (
    <Fragment>
      {/* <RoomsProvider> */}
        <Rooms />
      {/* </RoomsProvider> */}
    </Fragment>
  );
};  

export default RoomsWrappeer;
