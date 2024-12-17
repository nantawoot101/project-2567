const db = require('../models/db');

exports.getAllRole = async (req, res, next) => {
    try {
      const roles = await db.role.findMany();
      res.json(roles);
    } catch (err) {
      next(err);
    }
  };