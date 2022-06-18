import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from '@source/app/core/filters/all.exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableCors({
		origin: '*',
	});
	const config = app.get(ConfigService);
	app.useGlobalFilters(new AllExceptionsFilter());
  await app.setGlobalPrefix(config.get<string>('URL_ROOT'));
	await app.listen(config.get<number>('PORT'));
	return app;
}

bootstrap()
	.then(async (app) => {
		console.log(`App is running on: ${await app.getUrl()}`);
	})
	.catch((error: Error) => console.error(error.message));
