import { NextApiHandler } from "next";

const auth: NextApiHandler = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const authed = await lib.ldap.auth(userID, password);
    if (authed) {
      const token = jwt.sign({ userID }, config.secret);
      res.json({ ok: true, token });
    } else {
      const err = new Error("invalid userID or password");
      res.status(401).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export default auth;
