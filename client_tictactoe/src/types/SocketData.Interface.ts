import { SOCKET_CLIENT_EVENTS, SOCKET_SERVER_EVENTS } from "@/configs/socket.config";

export interface SocketData<P extends keyof typeof SOCKET_CLIENT_EVENTS | keyof typeof SOCKET_SERVER_EVENTS> {
    eventType: P;
    data: any;
}