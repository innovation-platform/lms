const { NotFoundError, ValidationError, AuthenticationError, AuthorizationError } = require("ca-webutils/errors");
const axios=require('axios');
const { sendMail } = require("../utils/emailUtil");
class BankerService {
    constructor(loanRepository, emiRepository) {
        this.loanRepository = loanRepository;
        this.emiRepository = emiRepository;
    }

    async getAllLoans() {
        const loans = await this.loanRepository.findAll();
        return loans;
    }
    calculateEMI(loanAmount, interestRate, loanDuration){
        const monthlyInterest = (interestRate / 100) / 12; // Convert annual rate to monthly
        const months = loanDuration * 12; // Convert years to months
    
        if (monthlyInterest === 0) return (loanAmount / months).toFixed(2); // If 0% interest
    
        const emi = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) /
                    (Math.pow(1 + monthlyInterest, months) - 1);
    
        return emi.toFixed(2); // Round to 2 decimal places
    };
    async approveLoan({ loanId, remarks }) {
        console.log("loanId", loanId);
        const loan = await this.loanRepository.findOne({ loanId });
        if (!loan) throw new NotFoundError(`Loan ${loanId} does not exist`, { loanId });
        const emiAmount = this.calculateEMI(loan.loanAmount, loan.interestRate, loan.loanDuration);
        console.log("emiAmount", emiAmount);
        const totalEmis = loan.loanDuration;
        const firstEmiDate = new Date();
        firstEmiDate.setMonth(firstEmiDate.getMonth() + 1);
        const firstEmi = await this.emiRepository.create({ loanId, emiNumber: 1, dueDate: firstEmiDate, amount: emiAmount, principal: emiAmount - (loan.loanAmount * (loan.interestRate / 100) / 12), interest: (loan.loanAmount * (loan.interestRate / 100) / 12) });
        loan.status = "Approved";
        loan.remarks = remarks;
        loan.emiAmount = emiAmount;
        loan.totalEmis = totalEmis;
        loan.paidEmis = 0;
        loan.nextEmiDate = firstEmiDate;
        loan.remainingPrincipal = loan.loanAmount;
        loan.approvedOn = new Date();
        console.log("loan", loan);
        await loan.save();
        await sendMail(loan.email, "Loan Approved", `Your loan of amount ${loan.loanAmount} has been approved. Your EMI amount is ${emiAmount}.`);
        return loan;
    }

    async rejectLoan({ loanId, remarks }) {
        const loan = await this.loanRepository.findOne({ loanId });
        if (!loan) throw new NotFoundError(`Loan ${loanId} does not exist`, { loanId });
        if (loan.status.toLowerCase() !== "pending") throw new ValidationError(`Loan ${loanId} is already processed`, { loanId });
        loan.status = "Rejected";
        loan.remarks = remarks;
        await loan.save();
        await sendMail(loan.email, "Loan Rejected", `Your loan of amount ${loan.loanAmount} has been rejected. Reason: ${remarks}`);
        return loan;

    }

    async getCibil(panNumber, token) {
        try {
          if (!token) {
            throw new AuthenticationError('Authentication token is required');
          }
      
          const response = await axios.get(`http://localhost:5003/api/cibil/${panNumber}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          return response.data.cibil_score || 700;
        } catch (error) {
          if (error.response?.status === 401) {
            throw new AuthenticationError('Invalid or expired token');
          }
          throw error;
        }
      }
      
      async getItr(panNumber, token) {
        try {
          if (!token) {
            throw new AuthenticationError('Authentication token is required');
          }
      
          const response = await axios.get(`http://localhost:5002/api/itr/${panNumber}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          return response.data.annualIncome || 200000;
        } catch (error) {
          if (error.response?.status === 401) {
            throw new AuthenticationError('Invalid or expired token');
          }
          throw error;
        }
      }
      
      async updateScores({panNumber, loanId, token}) {
        try {
          if (!token) {
            throw new AuthenticationError('Authentication token is required');
          }
      
          const cibil = await this.getCibil(panNumber, token);
          const itr = await this.getItr(panNumber, token);
          
          const loan = await this.loanRepository.findOne({loanId});
          if (!loan) {
            throw new NotFoundError(`Loan ${loanId} not found`);
          }
          
          loan.cibilScore = cibil;
          loan.itrValue = itr;
          await loan.save();
          
          return loan;
        } catch (error) {
          console.error('Error updating scores:', error);
          throw error;
        }
      }
      
}

BankerService._dependencies = ['loanRepository', 'emiRepository'];

module.exports = BankerService;

