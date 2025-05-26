const nodemailer = require('nodemailer');

// utils/sendWelcomeEmail.js
require('dotenv').config();


const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Missing');

    const mailOptions = {
      from: `"EventManager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to Event Manager!',
      html: `
        <h2>Hi ${name},</h2>
        <p>Welcome to <strong>EventEase</strong>! We're thrilled to have you on board.</p>
        <p>You can now log in and start exploring exciting events!</p>
        <br>
        <p>Regards,<br/>EventEase Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to:", email);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

module.exports = sendWelcomeEmail;
