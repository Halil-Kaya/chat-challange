import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

/*
* User in arkadaslarindan gelen gorulmemis mesajlari
* bulabilmek icin arkadaslarinin kim oldugu bilgisine ihtiyacim var
* bunun icin her seferinde db ye sorgu atmak yerine
* kisinin arkadaslarinin id bilgisini cache de tutuyorum
* boylece hizli bir sekilde kisinin arkadaslarinin id sine erisebiliyorum
* redis kullanmamin sebebi bu
* */
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