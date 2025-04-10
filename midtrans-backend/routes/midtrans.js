const express = require("express");
const router = express.Router();
const midtransClient = require("midtrans-client");

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false, // true jika sudah live
  serverKey: "SB-Mid-server-DdPua8zrwlNGIh_dIBjOo1Tn",
});

router.post("/create-transaction", async (req, res) => {
  const { orderId, gross_amount, nama } = req.body;


  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: gross_amount,
    },
    customer_details: {
      first_name: nama,
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    res.status(500).json({ message: "Gagal membuat transaksi" });
  }
});

module.exports = router;
