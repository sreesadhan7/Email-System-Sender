// Node.js Backend to save user data to Oracle DB and send confirmation email

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const { getConnection } = require('./db-config'); // Import Oracle DB connection

const app = express();

app.use(cors()); // CORS middleware to allow cross-origin requests 
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (if needed)

// Save User API
app.post('/api/saveUser', async (req, res) => {
    const { name, email } = req.body;
    console.log('Save User API called with:', { name, email });

    try {
        console.log('Saving user:', { name, email });
        const connection = await getConnection();
        const sql = `INSERT INTO users (name, email) VALUES (:name, :email)`;
        const binds = { name, email };
        await connection.execute(sql, binds, { autoCommit: true });
        await connection.close();
        res.send('User saved successfully');
    } catch (err) {
        console.error('Error saving user:', err.message);
        res.status(500).send(`Failed to save user: ${err.message}`);
    }
});

// Send Email API
app.post('/api/sendEmail', async (req, res) => {
  const { email, name } = req.body;
  console.log('Send Email API called with:', { email, name });

  try {
      console.log('Sending email to:', email);

      // SMTP Transporter Configuration
      const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io", // Use environment variable or default to Mailtrap
          port: process.env.SMTP_PORT || 2525,
          auth: {
              user: process.env.SMTP_USER || "d33860424711d7", // Use environment variable or default Mailtrap user
              pass: process.env.SMTP_PASS || "75bf482c1b751f", // Use environment variable or default Mailtrap pass
          },
      });

      const mailOptions = {
          from: process.env.EMAIL_FROM || 'no-reply@example.com', // Sender email address
          to: email, // Recipient email address
          subject: 'Confirmation Email',
          text: `Hello ${name},\n\nYour email address (${email}) has been successfully saved!\n\nBest regards,\nTeam`, // Email content
      };

      const info = await transporter.sendMail(mailOptions);

      console.log('Message sent: %s', info.messageId);
      res.send('Confirmation email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error.message);
      res.status(500).send(`Failed to send email: ${error.message}`);
  }
});


// Test Database Connection
(async () => {
    try {
        const connection = await getConnection();
        console.log('Database connection successful');
        await connection.close();
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
})();

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});