import express from "express"
import cors from "cors";
import { ENV_VAR, ENV_VAR as config } from "@/configs/env.config";
import helmet from "helmet"
import bodyParser from "body-parser";
import { CORS_OPTIONS } from "@/configs/cors.config";
import proxy from "express-http-proxy";
import { createProxyMiddleware } from 'http-proxy-middleware';


const app = express();

const server_port = config.GATEWAY_SERVER_PORT;

// SOME MIDDLEWARES
app.use(helmet())
app.use(cors(CORS_OPTIONS));
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


app.use("/auth",createProxyMiddleware({target:ENV_VAR.AUTH_ROUTE, 
  pathRewrite:{
  "^/auth":"/",
}
}));
app.use("/general",createProxyMiddleware({target:ENV_VAR.GENERAL_ROUTE, pathRewrite:{
  "^/general":"/",
}}));





const appServer = app.listen(server_port, () => {
  console.log(`Gateway running at http://localhost:${server_port}`)
})



// SOCKET APP
const socketApp = express()
const socket_port = config.GATEWAY_SOCKET_PORT
socketApp.use(cors(CORS_OPTIONS));
// app.use(express.json());
socketApp.use(helmet())
socketApp.use("/socket",createProxyMiddleware({target:ENV_VAR.SOCKET_ROUTE,ws:true, pathRewrite:{
  "^/socket":"/",
}}));


const socketServer = socketApp.listen(socket_port,()=>{
  console.log(`Gateway Socket Server running at port: ${socket_port}  `)
})
export {appServer}