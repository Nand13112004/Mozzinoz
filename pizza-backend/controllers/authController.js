require('dotenv').config();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};


const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};


const getVerificationEmailTemplate = (name, url) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
        <h2 style="color: #333;">Welcome to Pizza App!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${url}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;
};


const sendVerificationEmail = async (user, token) => {
  try {
    
    const isConfigValid = await verifyEmailConfig();
    if (!isConfigValid) {
      throw new Error('Email configuration is invalid');
    }

    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.CLIENT_URL) {
      throw new Error('Missing required environment variables for email sending');
    }

    const url = `${process.env.CLIENT_URL}/verify/${token}`;
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Pizza App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your email - Pizza App",
      html: getVerificationEmailTemplate(user.name, url),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error; 
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const verificationToken = crypto.randomBytes(32).toString("hex");

    
    user = new User({
      name,
      email,
      password,
      verificationToken,
    });

    
    await user.save();

    try {
      
      await sendVerificationEmail(user, verificationToken);
      
      res.status(201).json({ 
        message: "Registration successful. Please check your email to verify your account.",
        email: user.email 
      });
    } catch (emailError) {
      
      await User.findByIdAndDelete(user._id);
      console.error('Email sending failed:', emailError);
      
      return res.status(500).json({ 
        message: "Failed to send verification email. Please check your email configuration.",
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).send("Invalid token");
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  // Redirect to user dashboard after verification
  res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    
    const emailSent = await sendVerificationEmail(user, verificationToken);
    if (!emailSent) {
      return res.status(500).json({ 
        message: "Failed to send verification email. Please try again." 
      });
    }

    res.status(200).json({ 
      message: "Verification email sent. Please check your inbox.",
      email: user.email 
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ message: "Failed to resend verification email. Please try again." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // Find user in MongoDB
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  // Only allow users (not admins)
  if (user.role !== 'user') {
    return res.status(403).json({ message: "Admins must log in from the admin panel." });
  }

  // Generate token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; 
    await user.save();

    const url = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Reset Password",
      html: `<h3>Click to reset your password:</h3><a href="${url}">${url}</a>`,
    });

    res.status(200).json({ message: "Password reset link sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // If the token is for admin (no id, but has email and role)
    if (req.user && req.user.role === 'admin' && !req.user.id) {
      return res.json({
        user: {
          email: req.user.email,
          role: 'admin',
          name: 'Admin'
        }
      });
    }
    // Existing logic for normal users
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user data" });
  }
};
