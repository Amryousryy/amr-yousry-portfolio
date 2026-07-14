import mongoose from "mongoose";
import dns from "dns";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

let resolvedUri: string | null = null;

async function getResolvedUri(): Promise<string> {
  if (resolvedUri) return resolvedUri;

  let uri = MONGODB_URI!;

  if (process.env.NODE_ENV !== "production" && MONGODB_URI!.startsWith("mongodb+srv://")) {
    const match = MONGODB_URI!.match(/^mongodb\+srv:\/\/(.+@)?(.+?)(\/.*)?$/);
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

  resolvedUri = uri;
  return resolvedUri;
}

async function connectToMongo(): Promise<typeof mongoose> {
  const uri = await getResolvedUri();
  return mongoose.connect(uri, { bufferCommands: false });
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connectToMongo();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
