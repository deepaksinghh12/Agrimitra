import mongoose from 'mongoose';

/**
 * Global Mongoose Connection Cache
 * 
 * Next.js runs in a serverless environment where new instances are spun up frequently.
 * To prevent exhausting database connections, we use a global cache to reuse
 * the connection across hot reloads and lambda invocations.
 */

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Global augmentation for TypeScript
declare global {
    var mongoose: MongooseCache;
}

// Initialize cached connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (!MONGODB_URI) {
        // In development/build when env vars might be missing, fail gracefully or warn
        console.warn('MONGODB_URI is not defined in environment variables');
        // throw new Error('Please define the MONGODB_URI environment variable');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;
