const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const adminUser = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isAdmin: true,
      isVerified: true,
    });

    await adminUser.save();
    console.log('Admin user created successfully with email: admin@example.com and password: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
