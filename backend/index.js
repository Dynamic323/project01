// index.js
require("dotenv").config();
const express = require("express");
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");
const viewRoutes = require("./routes/viewRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", uploadRoutes);
app.use("/api", viewRoutes);

// Root
app.get("/", (req, res) => {
  res.send("DyShareX Backend is Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
