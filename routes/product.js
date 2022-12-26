const express = require("express");
const upload = require("../utils/fileUpload");
const { isAuthenticated, isSeller, isBuyer } = require("../middlerwares/auth");
const Product = require("../models/productModel");
const router = express.Router();
const { stripKey } = require("../config/credentials");
const Order = require("../models/orderModel");
const stripe = require("stripe")(stripKey);

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

    const savedProduct = await Product.create(productDetails);

    return res.status(200).json({
      status: "ok",
      productDetails: savedProduct,
    });
  });
});
router.get("/get/all", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({
      products,
    });
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.post("/buy/:productId", isAuthenticated, isBuyer, async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    })?.dataValues;

    if (!product) {
      return res.status(404).json({ err: "No product found " });
    }
    const orderDetails = {
      productId,
      buyerId: req.user.id,
    };

    let paymentMethod = await stripe.paymentMethod.create({
      type: "card",
      card: {
        number: " 4242424242424242",
        exp_month: 9,
        exp_year: 2023,
        cvc: "314",
      },
    });
    let paymentIntent = await stripe.paymentIntent.create({
      amount: product.price,
      currency: "inr",
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirm: true,
    });

    if(paymentIntent) {
      const createOrder = await Order.create(orderDetails);
      return res.status(200).json({
        createOrder
      });
    } else {
      return res.status(400).json{
        err:"payment failed"
      }
    }


  } catch (e) {
    res.status(500).json({ err: e });
  }
});

module.exports = router;
