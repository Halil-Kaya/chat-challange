import { AppMode } from '@source/config/app.mode';
export interface Environment {
	MODE: AppMode;
	URL_ROOT: string;
	API_KEY: string;
	PORT: number;
	MONGO_CONNECTION_STRING: string;
	JWT_SECRET: string;
	JWT_EXPIRES: string;
	JWT_ALGORITHM: string;
	JWT_REFRESH_TOKEN_SECRET: string;
	JWT_REFRESH_TOKEN_EXPIRES: string;
	JWT_REFRESH_ALGORITHM: string;
}