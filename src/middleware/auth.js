import jwt from "jsonwebtoken";
import { dbConnection } from "../storage/connection.js";

export const protect = async (req, res, next) => {
  try {
    const { userStorage } = await dbConnection;

    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userStorage.getUserByName(decoded.name);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const boss = async (req, res, next) => {
  if (req.user && req.user.positions.includes("boss")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as boss" });
  }
};
