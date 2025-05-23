const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendWelcomeEmail = require('../utils/sendWelcomeEmail'); // ✅ import

exports.registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const role = req.body.role;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Pass plain password here, no manual hashing!
    const user = new User({ name, email, password, role });

    await user.save(); // pre-save hook hashes password before saving

    await sendWelcomeEmail(email, name);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      token,
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id
    });
  } catch (error) {
    console.error('🚨 Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    console.log("Login attempt:", `"${email}"`, `"${password}"`);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("✅ User found:", user.email);
    console.log("🔐 DB hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('🚨 Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
