const express = require("express");
const app = express();

const PORT = 1338;

//middlewares
app.use(express.json());
app.use(express.static("content"));

app.listen(PORT, () => {
  console.log("Server Running...app.");
});
