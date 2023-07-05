const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express();
const lib = require("../lib");

module.exports = (logger) => {
  router.get("/pubkey", authed, async (req, res, next) => {
    try {
      const pubkey = await lib.ldap.getPubkey(req.userID);
      res.json({ ok: true, pubkey });
    } catch (err) {
      next(err);
    }
  });

  router.post("/pubkey", authed, async (req, res, next) => {
    const pubkey = req.body.pubkey.trim();
    try {
      await lib.ldap.addPubkey(req.userID, pubkey);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  router.delete("/pubkey", authed, async (req, res, next) => {
    const { pubkey } = req.body;
    try {
      await lib.ldap.delPubkey(req.userID, pubkey);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  router.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  router.use((err, req, res, next) => {
    const message = err.message;
    const status = err.status == null ? 500 : err.status;

    res.status(status);
    res.json({ ok: false, message, status });

    if (status == 500) {
      logger.error(err.stack);
    }
  });

  return router;
};
