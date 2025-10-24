import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response, NextFunction } from 'express';
import User from "../models/User";
import config from "../utils/config";

// --- Función para LOGIN ---
export const login = async (req: Request, res: Response, next: NextFunction) => {

    // Obtenemos el username y la contraseña del body.
    const { username, password } = req.body;
    
    // Buscamos el usuario en la base de datos.
    const user = await User.findOne({ username });

    // Si el usuario existe, comparamos la contraseña.
    if (user) {
      
      // Comparamos la contraseña.
      const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

      // Si la contraseña es correcta, generamos un token, sino, enviamos un error.
      if (!passwordCorrect) {
          res.status(401).json({
            error: "Nombre de usuario o contraseña inválido",
          });

        // Si la contraseña es correcta, generamos un token.
        } else {

          // Creamos el objeto userForToken, con el username, csrf y id.
          const userForToken = {
            username: user.username,
            csrf: crypto.randomUUID(),
            id: user._id,
          };

          // Generamos el token.
          const token = jwt.sign(userForToken, config.JWT_SECRET, {
            expiresIn: 60 * 60,
          });

          // Enviamos el token.
          res.setHeader("X-CSRF-Token", userForToken.csrf);
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          res.status(200).send({ username: user.username });
        }
    
    // Si el usuario no existe, enviamos un error.
    } else {
        res.status(401).json({
          error: "Nombre de usuario o contraseña inválido",
        });
    }
};

// --- Función para REGISTER ---
export const register = async (req: Request, res: Response, next: NextFunction) => {

  // Obtenemos el username y la contraseña del body.
  const { username, password } = req.body;

  // Generamos el hash de la contraseña.
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Creamos el usuario, con el username y el hash de su contraseña.
  const user = new User({
    username,
    passwordHash,
  });

  // Guardamos el usuario.
  const savedUser = await user.save();

  // Enviamos el usuario.
  res.status(201).json(savedUser);
};

// --- Función para ME ---
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Buscamos el usuario en la base de datos usando el ID del token
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Enviamos solo la información necesaria del usuario
    res.status(200).json({
      username: user.username,
      id: user._id
    });
  } catch (error) {
    next(error);
  }
};

// --- Función para LOGOUT ---
export const logout = async (req: Request, res: Response, next: NextFunction) => {

  // Limpiamos la cookie.
  res.clearCookie("token");

  // Enviamos un mensaje.
  res.status(200).send({
    message: "Sesión cerrada"
  });

};

