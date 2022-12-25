const express = require("express");
const upload = require("../utils/fileUpload");
const { isAuthenticated, isSeller } = require("../middlerwares/auth");
const router = express.Router();

router.post("/create", isAuthenticated, isSeller, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log("coming in err", err);
      return res.status(500).send(err);
    }
    const { name, price } = req.body;
    if (!name || !price || !req.file) {
      return res.status(400).json({
        err: "we require all 3",
      });
    }
    if (Number.isNaN(price)) {
      return res.status(400).json({
        err: "Price should be number",
      });
    }
    let productDetails = {
      name,
      price,
      content: req.file.path,
    };
    return res.status(200).json({
      status: "ok",
      productDetails,
    });
  });
});

module.exports = router;