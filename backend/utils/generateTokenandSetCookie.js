const jwt = require("jsonwebtoken");

/**
 * Generates both Access Token (short-lived) and Refresh Token (long-lived)
 * Sets the refresh token as an httpOnly cookie
 * Returns the access token
 */
const generateTokenandSetCookie = (userId, res) => {
  // 1️⃣ Access Token — short-lived, used in Authorization header
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m", // 15 minutes
  });

  // 2️⃣ Refresh Token — long-lived, stored in httpOnly cookie
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d", // 7 days
    }
  );

  res.cookie("refreshAccessToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
};

module.exports = { generateTokenandSetCookie };
