import { NextApiHandler } from "next";

const shell: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const shell = await lib.ldap.getShell(req.userID);
      res.json({ ok: true, shell });
    } catch (err) {
      next(err);
    }
  }

  if (req.method === "POST") {
    const { shell } = req.body;
    try {
      await lib.ldap.setShell(req.userID, shell);
      res.json({ ok: true, shell });
    } catch (err) {
      next(err);
    }
  }
};
