import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGO_URI;

export default {
  MONGODB_URI,
  PORT
};