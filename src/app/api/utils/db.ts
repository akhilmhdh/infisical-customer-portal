import mongoose, { Connection } from 'mongoose';
import { MONGO_MAIN_DB_URI, MONGO_LICENSE_DB_URI, DB_MAIN, DB_LICENSE } from '@/app/api/config';
import { userModel } from '@/app/api/models';

if (!MONGO_MAIN_DB_URI || !MONGO_LICENSE_DB_URI) {
  throw new Error(
    'Please define the MONGO_MAIN_DB_URI and MONGO_LICENSE_DB_URI environment variables inside .env.local',
  );
}

let cachedDBs = global.mongoose;

if (!cachedDBs) {
  cachedDBs = global.mongoose = {
    main: { conn: null },
    license: { conn: null },
  };
}

export function dbConnect(dbName: string): Promise<Connection> {
  if (!dbName || (dbName !== 'main' && dbName !== 'license')) {
    throw new Error('Please provide a valid dbName (either "main" or "license")');
  }

  if (cachedDBs[dbName]?.conn) {
    return cachedDBs[dbName]?.conn;
  }

  const MONGO_URL = dbName === 'main' ? MONGO_MAIN_DB_URI : MONGO_LICENSE_DB_URI;

  try {
    if (!cachedDBs[dbName].conn && mongoose.createConnection) {
      cachedDBs[dbName].conn = mongoose.createConnection(MONGO_URL!);
    }
  } catch (e) {
    throw e;
  }

  return cachedDBs[dbName].conn;
}

export const mainDBConnection = dbConnect(DB_MAIN);
export const licenseDBConnection = dbConnect(DB_LICENSE);