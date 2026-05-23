import mongoose from "mongoose";
import dns from "dns";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  if (cached && cached.conn) {
    return cached.conn;
  }

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let uri = MONGODB_URI;

    if (process.env.NODE_ENV !== "production" && MONGODB_URI.startsWith("mongodb+srv://")) {
      const match = MONGODB_URI.match(/^mongodb\+srv:\/\/(.+@)?(.+?)(\/.*)?$/);
      if (match) {
        const creds = match[1] || "";
        const host = match[2].split("?")[0];
        const suffix = match[3] || "";
        const srvHost = `_mongodb._tcp.${host}`;
        try {
          const originalServers = dns.getServers();
          dns.setServers(["8.8.8.8", "1.1.1.1"]);
          const records = await dns.promises.resolveSrv(srvHost);
          dns.setServers(originalServers);
          const hosts = records
            .sort((a, b) => a.priority - b.priority || a.weight - b.weight)
            .map((r) => `${r.name}:${r.port}`);
          const query = match[2].includes("?") ? match[2].split("?").slice(1).join("?") : suffix.split("?").slice(1).join("?");
          const qs = query ? `?${query}&tls=true&retryWrites=true&w=majority` : "?tls=true&retryWrites=true&w=majority";
          uri = `mongodb://${creds}${hosts.join(",")}${suffix.split("?")[0]}${qs}`;
        } catch {
          dns.setServers(["8.8.8.8", "1.1.1.1"]);
        }
      }
    }

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    if (cached) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    if (cached) {
      cached.promise = null;
    }
    throw e;
  }

  return cached?.conn;
}

export default dbConnect;
