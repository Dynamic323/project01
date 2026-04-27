require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://dysharex.pxxl.click",
    ],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/view", require("./routes/viewRoutes"));

app.get("/", (req, res) =>
  res.send(
    "DyShareX Backend is Running ✅ yes na me add the emoji looks cool :)",
  ),
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Schedule expired uploads cleanup every night at midnight
  const cron = require("node-cron");
  const deleteExpiredUploads = require("./scripts/deleteExpired");

  cron.schedule("0 0 * * *", () => {
    deleteExpiredUploads();
  });
  console.log("Cron job scheduled: Expired uploads cleanup every night at midnight.");
});
