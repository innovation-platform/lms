require("dotenv").config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const EMI = require("./emi.model");
const Loan = require("./loan.model");

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Email Setup using Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to Fetch Pending EMIs and Send Reminders
async function fetchAndSendReminders() {
    console.log(" Running cron job to check pending EMIs...");

    try {
        const today = new Date();
        const twoDaysLater = new Date();
        twoDaysLater.setDate(today.getDate() + 2); // Set the date to 2 days later

        // Fetch Pending EMIs due within the next 2 days
        const emiPayments = await EMI.find({
            status: "Pending",
            dueDate: { $gte: today, $lte: twoDaysLater }
        }).populate("loanId"); // Get customer details from Loan collection

        if (emiPayments.length === 0) {
            console.log("No pending EMI payments due within 2 days.");
            return;
        }

        console.log(`Found ${emiPayments.length} pending EMIs. Sending reminders...`);

        // Process Each EMI Payment
        for (const emi of emiPayments) {
            const customerName = emi.loanId?.customerName || "Customer";
            const email = emi.loanId?.email || null;

            if (!email) {
                console.log(` No email found for Loan ID: ${emi.loanId?._id}`);
                continue;
            }

            const emailContent = `
                <h1>EMI Payment Reminder</h1>
                <p>Dear ${customerName},</p>
                <p>Your EMI payment of ₹${emi.amount} is due on ${emi.dueDate.toDateString()}.</p>
                <p>Please make the payment on time to avoid penalties.</p>
            `;

            // Send Email
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "EMI Payment Reminder",
                    html: emailContent,
                });
                console.log(`Email sent to: ${email}`);
            } catch (error) {
                console.error(` Error sending email to ${email}:`, error);
            }
        }
    } catch (error) {
        console.error("Error fetching EMI payments:", error);
    }
}

// Schedule Cron Job to Run Every Day at 9 AM
cron.schedule("0 9 * * *", () => {
    fetchAndSendReminders();
});

console.log(" Cron job scheduled to run daily at 9 AM.");
// require("dotenv").config();
// const mongoose = require("mongoose");
// const cron = require("node-cron");
// const nodemailer = require("nodemailer");
// const EMI = require("./emi.model"); // Import EMI model
// const Loan = require("./loan.model"); // Import Loan model

// //  MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log(" Connected to MongoDB"))
//   .catch((error) => console.error("Error connecting to MongoDB:", error));

// // Email Configuration (Nodemailer)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Function to Check Pending EMIs
// async function checkPendingEMIs() {
//   console.log("Running cron job to check pending EMIs...");

//   try {
//     const currentDate = new Date();
//     const twoDaysLater = new Date();
//     twoDaysLater.setDate(currentDate.getDate() + 2);

//     // Find Pending EMIs Due in Next 2 Days
//     const payments = await EMI.find({
//       status: "Pending",
//       dueDate: { $gte: currentDate, $lte: twoDaysLater }
//     });

//     console.log(` ${payments.length} Pending EMIs Found:`, payments);

//     for (const payment of payments) {
//       //  Fetch Customer Name from Loan Model
//       const loan = await Loan.findOne({ loanId: payment.loanId });

//       if (!loan) {
//         console.log(` No Loan Found for Loan ID: ${payment.loanId}`);
//         continue;
//       }

//       console.log(`Sending Email to: ${loan.email} for EMI ${payment.emiNumber}`);

//       // Email Content
//       const emailContent = `
//         <h1>EMI Payment Reminder</h1>
//         <p>Dear ${loan.customerName},</p>
//         <p>Your EMI payment of ₹${payment.amount} is due on ${payment.dueDate.toDateString()}.</p>
//         <p>Please make the payment to avoid late fees.</p>
//       `;

//       try {
//         // Send Email
//         await transporter.sendMail({
//           from: process.env.EMAIL_USER,
//           to: loan.email,
//           subject: "EMI Payment Due Reminder",
//           html: emailContent
//         });
//         console.log(`Email Sent to ${loan.email}`);
//       } catch (error) {
//         console.error(`Error Sending Email to ${loan.email}:`, error);
//       }
//     }
//   } catch (error) {
//     console.error("Error Fetching EMIs:", error);
//   }
// }

// // Run Cron Job Every Minute for Testing (Change Later)
// cron.schedule("* * * * *", async () => {
//   console.log("Running Cron Job...");
//   await checkPendingEMIs();
// });
