import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { RedisIoAdapter } from "@source/app/core/adapters/redis-io.adapter";
import { AllExceptionsFilter } from "@source/app/core/filters/all.exceptions.filter";
import { Environment } from "@source/config/environment";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: "*"
  });
  const config = app.get<ConfigService<Environment>>(ConfigService);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.setGlobalPrefix(config.get<string>("URL_ROOT"));
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useGlobalPipes(new ValidationPipe({
    whitelist           : true,
    forbidNonWhitelisted: true
  }));
  //Projenin ölçeklenebilir bir yapıya sahip olması gerekiyor o yuzden redis adapter u kullandim.
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(config.get<number>("PORT"));
  return app;
}

bootstrap()
  .then(async (app) => {
    console.log(`App is running on: ${ await app.getUrl() }`);
  })
  .catch((error: Error) => console.error(error.message));
