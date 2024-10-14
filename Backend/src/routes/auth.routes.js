import express from "express";
import jwt from "jsonwebtoken";
import Trainer from "../models/Trainer.model.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const cookiesOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 86400000,
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided. Unauthorized access." });
  }

  try {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Token verification error" });
      }

      req.email = decoded.email;
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

router.post("/login/trainer", async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Step 2: Find trainer by email
    const trainer = await Trainer.findOne({ email });

    // Step 3: Check if trainer exists
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found." });
    }

    // Step 4: Check password
    // const isMatch = await bcrypt.compare(password, trainer.password);
    const isMatch = password === trainer.password ? true : false;
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Step 5: Generate JWT token
    const token = jwt.sign(
      { id: trainer._id, email: trainer.email, role: "trainer" }, // Payload
      JWT_SECRET, // Secret key (make sure it's set in your environment)
      { expiresIn: "1d" } // Token expiry time
    );

    // Step 6: Set token in cookies
    res.cookie("token", token, cookiesOptions);

    // Step 7: Send response
    return res
      .status(200)
      .json({ message: "Login successful", id: trainer._id });
  } catch (err) {
    console.error("Error during trainer login:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
router.post("/login/admin", async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = "admin@example.com";
  const adminPassword = "admin123"; // Use hashed password in production

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { id: "1", email: "admin@example.com", role: "admin" },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, cookiesOptions);

    return res.status(200).json({ message: "Admin login successful", token });
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
});

router.get("/getUser", verifyToken, async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.role === "admin") {
      return res.status(200).json({
        success: true,
        user: {
          email: req.email,
          role: req.role,
        },
      });
    }

    // If the user is a trainer, retrieve trainer details
    const trainer = await Trainer.findById(req.id);
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: trainer._id,
        email: trainer.email,
        role: req.role,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
