import * as jose from "jose";

import { env } from "./env";

const jwtSignAlgorithm = "HS256";
const secret = new TextEncoder().encode(env.secret);

export type Payload = {
  userID: string;
};

export const COOKIE_NAME_TOKEN = "token";
export const HEADER_USERID = "X-User-Id";

export const verifyToken = async (jwtString: string): Promise<Payload> => {
  const { payload } = await jose.jwtVerify(jwtString, secret);

  if (typeof payload["userID"] === "string") {
    return payload as Payload;
  } else {
    throw new Error("userID does not exist on palyoad");
  }
};

export const signToken = async (userID: string): Promise<string> => {
  const payload: Payload = {
    userID,
  };

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({
      alg: jwtSignAlgorithm,
    })
    .setIssuedAt()
    .sign(secret);

  return jwt;
};

const parsePayload = (payload: unknown): Payload => {
  const result: Payload = { userID: "" };
  const p: any = payload;
  for (const key of Object.keys(result) as (keyof Payload)[]) {
    if (typeof p[key] === "undefined") {
      throw new Error(`invalid payload: required property '${key}' is missing`);
    }

    result[key] = p[key];
  }

  return result;
};
