import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Use Gmail SMTP or custom SMTP based on environment variables
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Gmail App Password
      }
    });
  }

  // Custom SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const transporter = createTransporter();

    const mailOptions = {
      from: `"GigFlow" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - GigFlow',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #FFEDD5 100%);
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .dark .container {
              background: linear-gradient(135deg, #0B0D10 0%, #14171C 50%, #1F2937 100%);
              color: #F9FAFB;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #F97316;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
            }
            .dark .footer {
              border-top-color: #444;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🚀 GigFlow</div>
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested to reset your password for your GigFlow account. Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #F97316;">${resetUrl}</p>
            <p><strong>This link will expire in 10 minutes.</strong></p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <div class="footer">
              <p>Best regards,<br>The GigFlow Team</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - GigFlow
        
        You requested to reset your password. Click the link below:
        
        ${resetUrl}
        
        This link will expire in 10 minutes.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        The GigFlow Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
