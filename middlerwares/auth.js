const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; //Bearer {TOKEN},after splitting [Bearer {TOKEN}]

    if (!authHeader) {
      return res.status(401).json({
        err: "Authorzation header not found",
      });
    }
    const token = authHeader.split("")[1];

    if (!token) {
      return res.status(401).json({
        err: "token not found",
      });
    }
    const decoded = jwt.verify(token, "SECRET MESSAGE");
    const user = await User.findOne({ where: { id: decoded.user.id } });
    if (!user) {
      return res.status(404).json({ err: "user not found" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.log("<<< Error is here what is it");
    return res.status(500).send(e);
  }
};

const isSeller = async (req, res, next) => {
  if (req.user.dataValues.isSeller) {
    next();
  } else {
    return res.status(401).json({
      err: "you are not seller",
    });
  }
};

module.exports = { isAuthenticated, isSeller };
