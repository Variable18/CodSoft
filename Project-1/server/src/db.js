import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }
  try {
    await mongoose.connect(uri, { dbName: 'User' }); // or include /User in URI
    console.log('MongoDB connected to database "User"');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // rethrow to let caller handle startup failure
  }
}
