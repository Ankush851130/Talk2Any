const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendEmailOtp = async (toEmail, otpCode) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Talk2Any Security" <no-reply@talk2any.com>',
    to: toEmail,
    subject: `🔐 ${otpCode} is your Talk2Any Verification Code`,
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0f172a; border-radius: 20px; padding: 30px; color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #818cf8; margin: 0; font-size: 24px;">Talk2Any Verification</h2>
          <p style="color: #94a3b8; font-size: 13px;">Confirm your email address identity</p>
        </div>
        <div style="background: #1e293b; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 10px;">Your 6-Digit Verification Code is:</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #38bdf8; padding: 10px; background: #090d16; border-radius: 12px; display: inline-block;">
            ${otpCode}
          </div>
          <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This code will expire in 10 minutes.</p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          If you did not request this verification, please ignore this email.
        </p>
      </div>
    `,
  };

  console.log(`\n======================================================`);
  console.log(`✉️ [EMAIL OTP SENT]`);
  console.log(`Target Email: ${toEmail}`);
  console.log(`Verification OTP Code: 👉 ${otpCode} 👈`);
  console.log(`======================================================\n`);

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[EmailService] OTP email delivered to ${toEmail}`);
    } catch (err) {
      console.error(`[EmailService] Failed to send email via SMTP:`, err.message);
    }
  }
};

module.exports = { sendEmailOtp };
