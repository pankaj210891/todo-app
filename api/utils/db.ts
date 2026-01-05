import mongoose from 'mongoose';

export async function connectToDB() {
  if (mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGO_URI!;
  await mongoose.connect(uri);
  console.log('Connected to MongoDB (Mongoose)');
}
