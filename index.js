const express = require("express");
const app = express();
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/user");
const PORT = 1338;

app.use("/api/v1/user", userRoutes);

//middlewares
app.use(express.json());
app.use(express.static("content"));
app.use(express.urlencoded({ extends: false }));

app.listen(PORT, () => {
  console.log("Server is Running...");
  connectDB();
});
