const User = require("../models/User");

exports.getUserByEmail = (req, res, next) => {
  User.findOne({ email: req.query.email })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

exports.getUserByUsername = (req, res, next) => {
  User.findOne({ username: req.query.username })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};
