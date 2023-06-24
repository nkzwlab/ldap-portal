import jwt from "jsonwebtoken";
import { env } from "./env";

export type Payload = {
  userID: string;
};

export const COOKIE_NAME_TOKEN = "token";
export const HEADER_USERID = "X-User-Id";

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

export const signToken = (userID: string): Promise<string> => {
  const payload: Payload = {
    userID,
  };

  const promise = new Promise<string>((resolve, reject) => {
    jwt.sign(payload, env.secret, {}, (err, token) => {
      if (err !== null) {
        reject(err);
      } else if (typeof token === "undefined") {
        reject(new Error("cloud not generate token"));
      } else {
        resolve(token);
      }
    });
  });

  return promise;
};
