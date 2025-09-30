const crypto = require("crypto");
const axios = require("axios");
const { createOrder } = require("./orderController");

const partnerCode = "MOMO"; // Lấy trên MoMo Dev
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const redirectUrl = "http://localhost:5173/orders-susscess"; // frontend sau khi thanh toán
const ipnUrl = "https://b33d42c26631.ngrok-free.app/api/momo/callback" // server nhận callback từ MoMo

const createPayment = async (req, res) => {
  try {
    const { amount, orderInfo ,customer, branch, products} = req.body;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const requestType = "captureWallet";
    // const extraData = "";
    const extraDataObj = { customer, branch, products };
    const extraData = Buffer.from(JSON.stringify(extraDataObj)).toString("base64");

    const rawSignature =
      "accessKey=" + accessKey +
      "&amount=" + amount +
      "&extraData=" + extraData +
      "&ipnUrl=" + ipnUrl +
      "&orderId=" + orderId +
      "&orderInfo=" + orderInfo +
      "&partnerCode=" + partnerCode +
      "&redirectUrl=" + redirectUrl +
      "&requestId=" + requestId +
      "&requestType=" + requestType;

    const signature = crypto.createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl, // ✅ user quay lại đây
      ipnUrl, // ✅ server nhận notify
      requestType: "captureWallet",
      extraData,
      signature,
      lang: "vi",
    };

    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody
    );

    return res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi tạo thanh toán MoMo", error: err.message });
  }
};

// Callback từ MoMo
const callback = async (req, res) => {
  const data = req.body;
  console.log("MoMo Callback:", data);

  try {
    if (data.resultCode === 0) {
      let extra = {};
      if (data.extraData) {
        extra = JSON.parse(Buffer.from(data.extraData, "base64").toString());
      }

      // Đảm bảo có đủ field cho createOrder
      await createOrder(
        {
          body: {
            customer: extra.customer,   // clerkId (string)
            service: extra.products[0]?.serviceId, // lấy serviceId
            branch: extra.branch,
            scheduledAt: new Date(), // tạm thời set hiện tại
            notes:  extra.notes,
            paymentMethod:"Thanh toán Momo",
            paymentStatus:"paid",
            price: data.amount, // map với schema Order
          },
        },
        {
          status: () => ({ json: () => {} }),
        }
      );
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Lỗi xử lý callback MoMo:", err);
    res.status(500).send("Error");
  }
};


module.exports = {
  callback,createPayment
}