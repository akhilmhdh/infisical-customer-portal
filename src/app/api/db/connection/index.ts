import mongoose from 'mongoose';
import { MONGO_URL } from '../../../../config';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
    const mongoURL = process.env.MONGO_URL;

    if (!mongoURL) {
        throw new Error(
            'Please define the MONGODB_URI environment variable.'
        );
    }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoURL)
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}