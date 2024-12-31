const nodemailer = require('nodemailer');

// Create the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // Receiver's email
        subject, // Email subject
        text, // Email body
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw new Error('Unable to send email');
    }
};

module.exports = sendEmail;
