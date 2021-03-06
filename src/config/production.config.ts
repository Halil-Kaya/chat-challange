import { AppMode } from "@source/config/app.mode";

export default () => ({
  MODE                     : AppMode.PRODUCTION,
  URL_ROOT                 : "/api",
  PORT                     : "3032",
  PAGINATION_LIMIT         : 5,
  MONGO_CONNECTION_STRING  : process.env.DB_URL,
  JWT_SECRET               : "R6sVBN0PHKT3sLdmXpjAxJMPXhuDnyrsccWqmpgu7qw",
  JWT_EXPIRES              : "30d",
  JWT_ALGORITHM            : "HS256",
  JWT_REFRESH_TOKEN_SECRET : "5CQQeFKWeEnqB1nCXPdv7xB3ec0PMeZ8gv8sF0JAhuyg1RVHcW1",
  JWT_REFRESH_TOKEN_EXPIRES: "3600d",
  JWT_REFRESH_ALGORITHM    : "HS256",
  REDIS                    : {
    URL : process.env.REDIS_URL,
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT
  }
});