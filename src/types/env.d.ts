declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      JWT_SECRET?: string;
      VERCEL?: string;
      PORT?: string;
    }
  }
}

export {};
