import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private config;

  constructor(app: NestExpressApplication) {
    super(app);
    this.config = app.get(ConfigService);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: this.config.internalConfig.REDIS.URL });
    const subClient = pubClient.duplicate();
    await Promise.all([ pubClient.connect(), subClient.connect() ]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}