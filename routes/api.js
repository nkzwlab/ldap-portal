const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express();
const lib = require('../lib');

module.exports = (logger)=>{
  router.post('/auth', async (req, res, next)=>{
    try {
      const {userID, password} = req.body;
      const authed = await lib.ldap.auth(userID, password);
      if (authed) {
        const token = jwt.sign({userID}, config.secret);
        res.json({ok: true, token});
      } else {
        const err = new Error('invalid userID or password');
        err.status = 403;
        next(err);
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('/shell', authed, async (req, res, next)=>{
    try {
      const shell = await lib.ldap.getShell(req.userID);
      res.json({ok: true, shell});
    } catch (err) {
      next(err);
    }
  });

  router.post('/shell', authed, async (req, res, next)=>{
    const {shell} = req.body;
    try {
      await lib.ldap.setShell(req.userID, shell);
      res.json({ok: true, shell});
    } catch (err) {
      next(err);
    }
  });

  router.get('/pubkey', authed, async (req, res, next)=>{
    try {
      const pubkey = await lib.ldap.getPubkey(req.userID);
      res.json({ok: true, pubkey});
    } catch (err) {
      next(err);
    }
  });

  router.post('/pubkey', authed, async (req, res, next)=>{
    const pubkey = req.body.pubkey.trim();
    try {
      await lib.ldap.addPubkey(req.userID, pubkey);
      res.json({ok: true});
    } catch (err) {
      next(err);
    }
  });

  router.delete('/pubkey', authed, async (req, res, next)=>{
    const {pubkey} = req.body;
    try {
      await lib.ldap.delPubkey(req.userID, pubkey);
      res.json({ok: true});
    } catch (err) {
      next(err);
    }
  });

  router.post('/password', authed, async (req, res, next)=>{
    const {password, newPassword} = req.body;
    try {
      await lib.ldap.updatePassword(req.userID, password, newPassword);
      res.json({ok: true});
    } catch (err) {
      next(err);
    }
  });

  router.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  router.use((err, req, res, next) => {
    const message = err.message;
    const status = err.status==null ? 500 : err.status;

    res.status(status);
    res.json({ok: false, message, status});

    if (status == 500) {
      logger.error(err.stack);
    }
  });

  return router;
};

function authed(req, res, next) {
  const token = req.body.token || req.query.token;
  if (token == null) {
    const err = new Error('Unauthorized');
    err.status = 403;
    return next(err);
  }
  try {
    const {userID} = jwt.verify(token, config.secret);
    req.userID = userID;
    return next();
  } catch (_) {
    const err = new Error('Invalid token');
    err.status = 400;
    return next(err);
  }
}
