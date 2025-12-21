import { Redis } from "ioredis";
import { config } from "@/config";

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  db: config.redis.db,
  lazyConnect: true,
});

export { redis };
