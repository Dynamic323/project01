const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// ---- REGISTER ----
const register = async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // 3. Insert user into DB
    const result = await pool.query(
      `INSERT INTO users (email, display_name, password_hash)
       VALUES ($1, $2, $3) RETURNING id, email, display_name, user_plan`,
      [email, displayName || null, password_hash],
    );

    const user = result.rows[0];

    // 4. Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //  Find user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        userPlan: user.user_plan,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const logout = (req, res) => {
  res.json({ message: "Logged out" });
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email, display_name, user_plan FROM users WHERE id = $1", [
      req.user.id,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      userPlan: user.user_plan,
    });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  const { displayName, email } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "UPDATE users SET display_name = COALESCE($1, display_name), email = COALESCE($2, email) WHERE id = $3 RETURNING id, email, display_name",
      [displayName, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login, logout, getMe, updateProfile };
