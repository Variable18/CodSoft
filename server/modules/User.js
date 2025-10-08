import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    name: { type: String },
    passwordHash: { type: String, required: true }
  },
  { collection: 'data', timestamps: true } // force collection name
);

export default mongoose.model('User', userSchema); // binds to DB “User”, collection “data”
