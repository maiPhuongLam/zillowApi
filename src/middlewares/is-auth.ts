import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserType } from "../entitites/user.entity";

interface UserPayload {
  id: string;
  userType: UserType;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json("Not authorization");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(
      token,
      process.env.JSON_TOKEN_KEY!
    ) as UserPayload;
  } catch (error: any) {
    return res.status(401).json("Not authorization");
  }
  if (!decodedToken) {
    return res.status(401).json("Token is incorrect");
  }
  req.userId = decodedToken.id;
  req.role = decodedToken.userType;
  next();
};
