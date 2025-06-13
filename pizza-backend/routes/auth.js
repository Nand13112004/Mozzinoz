const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  verifyEmail, 
  resendVerification,
  forgotPassword, 
  resetPassword,
  getCurrentUser
} = require("../controllers/authController");

const { isAuthenticated } = require("../middlewares/authMiddleware");
const jwt = require('jsonwebtoken');

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getCurrentUser);

router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerification);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_EMAIL_PASSWORD
  ) {
    // Generate JWT token for admin
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
});



module.exports = router;

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).send("Invalid token");
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  res.send("Email verified successfully!");
};
