import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendResetEmail = async (to, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"API Buddy" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `<p>Click the link below to reset your password:</p><a href="${resetURL}">${resetURL}</a><p>This link expires in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
