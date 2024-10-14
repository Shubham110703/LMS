import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers.Authorization;
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ message: "Invalid token." });
    }

    req._id = decoded._id;
    req.userType = decoded.userType;
    next();
  });
};