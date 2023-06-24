import jwt from "jsonwebtoken";
import { env } from "./env";

export type Payload = {
  userID: string;
};

export const parseBearer = (authorizaton: string): string | null => {
  const bearerText = "Bearer ";
  if (!authorizaton.startsWith(bearerText)) {
    return null;
  }

  const token = authorizaton.substring(bearerText.length, authorizaton.length);
  return token;
};

export const verifyToken = (jwtString: string): Promise<Payload> => {
  const promise = new Promise<Payload>((resolve, reject) => {
    jwt.verify(jwtString, env.secret, {}, (err, decoded) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(decoded as Payload);
      }
    });
  });

  return promise;
};
