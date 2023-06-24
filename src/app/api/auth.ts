import { COOKIE_NAME_TOKEN, signToken } from "@/lib/auth";
import { setCookie } from "@/lib/cookie";
import { statusInternalServerError, statusUnauthorized } from "@/lib/http";
import { NextApiHandler } from "next";

const auth: NextApiHandler = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const authed = await lib.ldap.auth(userID, password);

    if (authed) {
      const token = await signToken(userID);
      setCookie(res, COOKIE_NAME_TOKEN, token);

      res.json({ ok: true });
    } else {
      const err = new Error("invalid userID or password");
      res.status(statusUnauthorized).json(err);
    }
  } catch (err) {
    res.status(statusInternalServerError).json(err);
  }
};

export default auth;
