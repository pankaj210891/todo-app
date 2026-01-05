import mongoose from "mongoose";

// export async function connectToDB() {
//   if (mongoose.connection.readyState === 1) return;

//   const uri = process.env.MONGO_URI!;
//   await mongoose.connect(uri);
//   console.log('Connected to MongoDB (Mongoose)');
// }

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
