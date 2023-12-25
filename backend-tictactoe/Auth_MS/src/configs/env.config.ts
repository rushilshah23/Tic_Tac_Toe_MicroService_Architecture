import { config } from "dotenv";
import path from "path";

if (process.env.ENVIRONMENT !== 'PRODUCTION') {
    console.log("RUNNING IN DEVELOPMENT MODE")
    config({ path: path.resolve(__dirname, '../../.env.dev') });

} else {
    console.log("RUNNING IN PRODUCTION MODE ")
    // config();
    config({ path: path.resolve(__dirname, '../../.env') });

}

const {
    SERVER_PORT,
    CLIENT_URL,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    ENVIRNOMENT,
    BASE_DOMAIN,
    COOKIE_PARSER_SECRET,
    PROXY_GATEWAY,
    MONGODB_URL,
    DB_NAME
} = process.env;

export const ENV_VAR = {
    SERVER_PORT: SERVER_PORT!,
    CLIENT_URL: CLIENT_URL!,
    JWT_ACCESS_TOKEN_SECRET: JWT_ACCESS_TOKEN_SECRET!,
    JWT_REFRESH_TOKEN_SECRET: JWT_REFRESH_TOKEN_SECRET!,
    ENVIRNOMENT: ENVIRNOMENT! === 'DEVELOPMENT' ? false : true,
    BASE_DOMAIN: BASE_DOMAIN!,
    COOKIE_PARSER_SECRET: COOKIE_PARSER_SECRET!,
    PROXY_GATEWAY:PROXY_GATEWAY!,
    MONGODB_URL:MONGODB_URL!,
    DB_NAME:DB_NAME!

} 