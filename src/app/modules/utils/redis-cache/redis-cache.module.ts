import { RedisCacheService } from "@modules/utils/redis-cache/service/redis-cache.service";
import { Module, CacheModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Environment } from "@source/config/environment";
import * as redisStore from "cache-manager-redis-store";

@Module({
  imports  : [
    CacheModule.registerAsync({
      imports   : [ ConfigModule ],
      inject    : [ ConfigService ],
      useFactory: async (configService: ConfigService<Environment>) => ({
        store: redisStore,
        host : configService.get("REDIS").HOST,
        port : configService.get("REDIS").PORT
      })
    })
  ],
  providers: [ RedisCacheService ],
  exports  : [ RedisCacheService ]
})
export class RedisCacheModule {
}