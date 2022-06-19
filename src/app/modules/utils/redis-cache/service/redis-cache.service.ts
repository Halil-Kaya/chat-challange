import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {
  }

  async get<T>(key): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set(key, value: any): Promise<any> {
    return this.cache.set(key, value, { ttl: 0 });
  }

  async delete(key): Promise<any> {
    return this.cache.del(key);
  }
}