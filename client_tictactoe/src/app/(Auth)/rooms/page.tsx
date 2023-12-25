import RoomsWrappeer from "@/components/Rooms/RoomsWrappeer";
import StateReducerTest, {
  StateReducerTestParent,
} from "@/experiments/StateReducerTest";
import { FC, Fragment } from "react";

interface RoomsPageProps {}

const RoomsPage: FC<RoomsPageProps> = async ({}) => {
  return (
    <Fragment>
      <RoomsWrappeer/>
      {/* <StateReducerTestParent/> */}
    </Fragment>
  );
};

export default RoomsPage;
