const express = require("express");
const cors = require("cors");
const midtransRoute = require("./routes/midtrans");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/midtrans", midtransRoute);

app.listen(3001, () => {
  console.log("Server berjalan di http://localhost:3001");
});
