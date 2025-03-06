const nodemailer = require("nodemailer");
 
// Configure the mail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "smartloans.app@gmail.com",
        pass: "knsi yxuc tfjl zgtq",
    },
});
 
/**
 * Sends an email notification.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email content.
 */
const sendMail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: "smartloans.app@gmail.com",
            to,
            subject,
            text,
        };
 
        await transporter.sendMail(mailOptions);
        console.log(` Email sent successfully to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
 
module.exports = { sendMail };