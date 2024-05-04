const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: "rzp_test_ccDeDrRzUiorhL",
      key_secret: "ZSIaK0RK2OtTiaDZazCrBtvW",
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server Error!" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const hmac = crypto.createHmac("sha256", "ZSIaK0RK2OtTiaDZazCrBtvW");
    hmac.update(text);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({ message: "Payment Verified" });
    } else {
      return res.status(400).json({ message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server Error!" });
  }
});

module.exports = router;
