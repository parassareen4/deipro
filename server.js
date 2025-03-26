import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.json()); // Parses JSON payloads
app.use(express.static(join(__dirname, 'public'))); // Serves static files

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "kyakrnahaibro@gmail.com",
    pass: process.env.EMAIL_PASS || "ftnz vcxw utjz wumb"
  }
});

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission
app.post('/submit-report', async (req, res) => {
  try {
    const { name, phone, email, description } = req.body;

    console.log("Received Form Data:", req.body); // Debugging

    // Check for missing fields
    if (!name || !phone || !email || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || "kyakrnahaibro@gmail.com",
      to: process.env.RECIPIENT_EMAIL || "kyakrnahaibro@gmail.com",
      subject: 'New DEI Report Submission',
      html: `
        <h2>Confidential DEI Report</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Description of Incident:</h3>
        <p>${description}</p>
        <hr>
        <small>This is a confidential submission received through the DEI reporting system.</small>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Report submitted successfully. Thank you for your confidential submission.' 
    });

  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({ 
      message: 'There was an error submitting your report. Please try again later.' 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
