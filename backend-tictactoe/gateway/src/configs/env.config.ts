import {config} from "dotenv";
import path from "path";


if(process.env.ENVIRONMENT !=='PRODUCTION'){
    // const configFile = './.env.dev';
    // config({path:configFile});
    console.log("RUNNING IN DEVELOPMENT MODE ")

    config({ path: path.resolve(__dirname, '../../.env.dev') });

}else{
    console.log("RUNNING IN PRODUCTION MODE ")


    // config();
    config({ path: path.resolve(__dirname, '../../.env') });
    
}

const {
    GATEWAY_SERVER_PORT,
    GATEWAY_SOCKET_PORT,
    CLIENT_URL,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    ENVIRONMENT,
    BASE_DOMAIN,
    MONGO_DB_URL,
    COOKIE_PARSER_SECRET,
    AUTH_ROUTE,
    GENERAL_ROUTE,
    SOCKET_ROUTE
} = process.env;

export const ENV_VAR = {
    GATEWAY_SERVER_PORT:GATEWAY_SERVER_PORT!,
    GATEWAY_SOCKET_PORT:GATEWAY_SOCKET_PORT!,
    CLIENT_URL:CLIENT_URL!,
    JWT_ACCESS_TOKEN_SECRET:JWT_ACCESS_TOKEN_SECRET!,
    JWT_REFRESH_TOKEN_SECRET:JWT_REFRESH_TOKEN_SECRET!,
    ENVIRNOMENT:ENVIRONMENT! === 'DEVELOPMENT' ? false: true,
    BASE_DOMAIN:BASE_DOMAIN!,
    MONGO_DB_URL :MONGO_DB_URL!,
    COOKIE_PARSER_SECRET:COOKIE_PARSER_SECRET!,
    AUTH_ROUTE:AUTH_ROUTE!,
    GENERAL_ROUTE:GENERAL_ROUTE!,
    SOCKET_ROUTE:SOCKET_ROUTE!

} 