import { AppMode } from '@source/config/app.mode';
export default () => ({
	MODE: AppMode.DEVELOPMENT,
	URL_ROOT: '/api',
	PORT: '3032',
  //MONGO_CONNECTION_STRING: process.env.DB_URL,
  MONGO_CONNECTION_STRING: "mongodb://localhost:27017/chat_app",
	JWT_SECRET: 'R6sVBN0PHKT3sLdmXpjAxJMPXhuDnyrsccWqmpgu7qw',
	JWT_EXPIRES: '30d',
	JWT_ALGORITHM: 'HS256',
	JWT_REFRESH_TOKEN_SECRET: '5CQQeFKWeEnqB1nCXPdv7xB3ec0PMeZ8gv8sF0JAhuyg1RVHcW1',
	JWT_REFRESH_TOKEN_EXPIRES: '3600d',
	JWT_REFRESH_ALGORITHM: 'HS256',
  REDIS: process.env.REDIS_URL
});