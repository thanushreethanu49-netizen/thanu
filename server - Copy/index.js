const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 10 }); // 10 requests per minute
app.use('/api/', limiter);

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

function validateContact({ name, email, message }) {
  if (!name || name.trim().length < 2) return 'Name is required';
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Valid email required';
  if (!message || message.trim().length < 10) return 'Message must be at least 10 characters';
  return null;
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  const err = validateContact({ name, email, message });
  if (err) return res.status(400).json({ error: err });

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_TO_EMAIL) {
    return res.status(500).json({ error: 'SMTP not configured. Copy server/.env.example to server/.env and fill values.' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `Website Contact <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    subject: `New contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message.replace(/\n/g, '<br>')}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (e) {
    console.error('Mail send error:', e);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Fallback to index for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});