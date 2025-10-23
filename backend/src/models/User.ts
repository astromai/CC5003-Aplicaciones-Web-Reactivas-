import mongoose from "mongoose";

// --- INTERFAZ DE USUARIO ---
interface UserData {
  id: string;
  username: string;
  passwordHash: string;
}

// --- SCHEMA DE USUARIO ---
const userSchema = new mongoose.Schema<UserData>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

// --- CONFIGURACIÓN DEL SCHEMA ---
userSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: string;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
      passwordHash?: string;
    }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

// --- MODELO DE USUARIO ---
const User = mongoose.model("User", userSchema);

export default User;