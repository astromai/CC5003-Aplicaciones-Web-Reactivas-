import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import User from "../models/User";
import config from "../utils/config";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });

    if (user) {
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

        if (!passwordCorrect) {
          res.status(401).json({
            error: "Nombre de usuario o contraseña inválido",
          });
        } else {
          const userForToken = {
            username: user.username,
            csrf: crypto.randomUUID(),
            id: user._id,
          };

          const token = jwt.sign(userForToken, config.JWT_SECRET, {
            expiresIn: 60 * 60,
          });
          res.setHeader("X-CSRF-Token", userForToken.csrf);
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          res.status(200).send({ username: user.username });
        }
    } else {
        res.status(401).json({
          error: "Nombre de usuario o contraseña inválido",
        });
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const user = await User.findById(req.userId);;
  res.status(200).json(user);
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("token");
  res.status(200).send({
    message: "Sesión cerrada"
  });

};

