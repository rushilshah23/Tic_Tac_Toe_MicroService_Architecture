import { Request, Response, Router } from "express";
import { AuthRequest } from "../types/AuthRequest.Interface";
import { addUserToRoom, createRoom, getUserAllRooms, joinUserToRoom, leaveUserFromRoom, userInValidRoom } from "@/controllers/game";
import { authenticate } from "@/middlewares/authenticate.middleware";

const router = Router();

router.post("/create-room",authenticate,createRoom);
router.post("/add-user",authenticate,addUserToRoom);
router.post("/join-room",authenticate,joinUserToRoom)
router.post("/leave-room",authenticate,leaveUserFromRoom)
router.get("/get-rooms",authenticate,getUserAllRooms);
router.post("/in-valid-room",authenticate,userInValidRoom)



export {
    router as GameRouter
}