import { BaseError } from '@errors/base.error';
import { ErrorMessage } from '@errors/error.message';
import { ErrorStatus } from '@errors/error.status';
import { LoggerMiddleware } from '@middlewares/logger.middleware';
import { AuthModule } from "@modules/auth/auth.module";
import { UserModule } from "@modules/user/user.module";
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AllExceptionsFilter } from '@source/app/core/filters/all.exceptions.filter';
import { AppMode } from '@source/config/app.mode';
import developmentConfiguration from '@source/config/development.config';
import { Environment } from "@source/config/environment";

const ENV = process.env.MODE;
const configurationFile = (() => {
	switch (ENV) {
		case AppMode.DEVELOPMENT:
			return developmentConfiguration;
		default:
			throw new BaseError(
				ErrorStatus.SERVICE_UNAVAILABLE,
				ErrorMessage.INVALID_APP_MODE,
			);
	}
})();

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configurationFile],
			isGlobal: true,
		}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Environment>) => ({
        uri: configService.get<string>('MONGO_CONNECTION_STRING'),
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        connectionFactory: (connection) => {
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule
	],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}