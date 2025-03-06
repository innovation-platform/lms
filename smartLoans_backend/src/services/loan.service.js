const { NotFoundError, ValidationError, AuthenticationError,AuthorizationError } = require("ca-webutils/errors");
const multer = require("multer");
const { sendMail } = require("../utils/emailUtil");
 
 
// Set up Multer to store file buffers in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });
class LoanService{
    constructor(loanRepository){
        this.loanRepository = loanRepository;
    }

    generateLoanId(){
        return "LN" + Date.now()+Math.floor(1000+Math.random()*9000);
    }

    calculateEMI = (loanAmount, interestRate, loanDuration) => {
        const monthlyRate = interestRate / 100 / 12;
        return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanDuration));
    };
    
    uploadMiddleware = upload.any();

    async applyLoan(body,files) {
        const  {
            customerName, phoneNumber, email, panNumber, aadharNumber,
            loanAmount, interestRate, loanDuration, loanType, employmentType,
            guarantorName, guarantorIncome, relationship, accountNumber, remainingEmi, paymentDate,
            propertyValue, propertyLocation, // Home Loan fields
            courseName, institutionName, // Education Loan fields
            purpose, // Personal Loan field
            goldWeight, goldPurity // Gold Loan fields
        } = body;
        if (!customerName || !phoneNumber || !email || !panNumber || !aadharNumber || !loanAmount || !interestRate || !loanDuration || !loanType || !employmentType) {
            throw new ValidationError('Missing required fields', { body });
        }
        let status,reason;
        let suretyDetails=null;
        if (employmentType !== "Govt") {
            if (!guarantorName || !guarantorIncome || !relationship) {
                return res.status(400).json({ error: "Guarantor details required for non-government employees" });
            }
            suretyDetails = { guarantorName, guarantorIncome, relationship };
        }
        status = "Pending";
            reason = null;
            const emi_loan = this.calculateEMI(loanAmount, interestRate, loanDuration);
            const loanId = this.generateLoanId();
            const nextDueDate = new Date();
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            nextDueDate.setDate(10);
 
            // Convert files to Base64 and store in MongoDB
            const uploadedFiles = files ? files.map(file => ({
                filename: file.originalname,
                mimetype: file.mimetype,
                data: file.buffer.toString("base64")
            })) : [];

            const loanData = {
                loanId,
                accountNumber,
                customerName,
                phoneNumber,
                email,
                panNumber,
                aadharNumber,
                loanAmount,
                interestRate,
                loanDuration,
                loanType,
                employmentType,
                suretyDetails,
                status,
                reason,
                emi_loan,
                dueDate: nextDueDate,
                paymentDate,
                remainingEmi,
                documents: uploadedFiles
            };
            if (loanType === "Home Loan") {
                if (!propertyValue || !propertyLocation) return res.status(400).json({ error: "Home Loan requires property details" });
                loanData.propertyValue = propertyValue;
                loanData.propertyLocation = propertyLocation;
            }
            if (loanType === "Education Loan") {
                if (!courseName || !institutionName) return res.status(400).json({ error: "Education Loan requires course and institution details" });
                loanData.courseName = courseName;
                loanData.institutionName = institutionName;
            }
            if (loanType === "Personal Loan") {
                if (!purpose) return res.status(400).json({ error: "Personal Loan requires a purpose" });
                loanData.purpose = purpose;
            }
            if (loanType === "Gold Loan") {
                if (!goldWeight || !goldPurity) return res.status(400).json({ error: "Gold Loan requires gold weight and purity" });
                loanData.goldWeight = goldWeight;
                loanData.goldPurity = goldPurity;
            }

            const loan = await this.loanRepository.create(loanData);
            console.log("loan",loan);
            await sendMail(email, "Loan Application Received", `Your loan application of amount ${loanAmount} has been received. Your loan ID is ${loanId}.`);
            return {
                message: "Loan application successfull",
                loan
            }
    }
    async getLoansList({accountNumber}){
        if (!accountNumber) {
            throw new ValidationError('Missing required field', { accountNumber });
        }
        console.log("accountNumber",accountNumber);
 
        const loans = await this.loanRepository.findAll({ accountNumber });
        console.log("loans",loans);
        if (loans.length === 0) {
            throw new NotFoundError("No loans found for this account", { accountNumber });
        }
        return {
            message:"Loans retrieved successfully!",
            loans
        }
    }
}

LoanService._dependencies =[ 'loanRepository'];

module.exports = LoanService;

