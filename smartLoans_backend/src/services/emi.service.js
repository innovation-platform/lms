const { NotFoundError, ValidationError, AuthenticationError,AuthorizationError } = require("ca-webutils/errors");
const { sendMail } = require("../utils/emailUtil");

class EMIService{
    constructor(loanRepository,emiRepository,transactionRepository){
        this.loanRepository = loanRepository;
        this.emiRepository = emiRepository;
        this.transactionRepository = transactionRepository;
    }

    async processEMIPayment({loanId, paymentMethod, paymentDetails, amount}) {
        const loan = await this.loanRepository.findOne({loanId});
        if (!loan) throw new NotFoundError(`Loan ${loanId} does not exist`, {loanId});
        if (loan.status.toLowerCase() === 'completed') throw new ValidationError(`Loan ${loanId} is already completed`, {loanId});
        if (!loan.remainingPrincipal || !loan.interestRate || !loan.emiAmount) {
            throw new ValidationError(`Invalid loan details`, {loanId});
        }
        const nextEmiNumber = loan.paidEmis + 1;
        const emiAmount = parseFloat(loan.emiAmount);
    
        const monthlyInterestRate = (parseFloat(loan.interestRate) / 100) / 12;
        const interest = parseFloat((loan.remainingPrincipal * monthlyInterestRate).toFixed(2));
        const principal = parseFloat((emiAmount - interest).toFixed(2));
        if (isNaN(interest) || isNaN(principal) || interest < 0 || principal < 0) {
            throw new ValidationError(`Error in calculating EMI`, {loanId});
        }
        let lateFee = 0;
        if (loan.nextEmiDate && new Date() > new Date(loan.nextEmiDate)) {
            const daysLate = Math.floor((new Date() - new Date(loan.nextEmiDate)) / (1000 * 60 * 60 * 24));
            lateFee = parseFloat((emiAmount * 0.01 * daysLate).toFixed(2));
        }
    
        const totalDue = emiAmount + lateFee;
        if (amount < totalDue) {
            throw new ValidationError(`Insufficient payment amount`, {loanId});
        }
        const emi = await this.emiRepository.create({loanId, emiNumber: nextEmiNumber, dueDate: new Date(loan.nextEmiDate), amount: emiAmount, principal, interest, lateFee, status: 'Paid'});
        const transaction = await this.transactionRepository.create({loanId, emiId: emi._id, amount: totalDue, lateFee, paymentMethod, status: 'Success'});
        loan.paidEmis += 1;
        loan.remainingPrincipal = parseFloat((loan.remainingPrincipal - principal).toFixed(2));
        if (loan.paidEmis < loan.totalEmis) {
            const nextEmiDate = new Date(loan.nextEmiDate);
            nextEmiDate.setMonth(nextEmiDate.getMonth() + 1);
            loan.nextEmiDate = nextEmiDate;
        } else {
            loan.status = 'Completed';
            loan.nextEmiDate = null;
        }
        await loan.save();
        await sendMail(loan.email, 'EMI Payment', `Your EMI payment of amount ${totalDue} has been received for loan ${loan.loanId}.`);
        return {
            success: true,
            message: "EMI payment successful",
            data: {
              loanId: loan.loanId,
              paidAmount: totalDue,
              remainingPrincipal: loan.remainingPrincipal,
              remainingEmis: loan.totalEmis - loan.paidEmis,
              nextEmiDate: loan.nextEmiDate,
              emiDetails: {
                principal,
                interest,
                emiAmount,
                lateFee
              }
            }};
    }


    async getEMIHistory(loanId){

        const loan=await this.loanRepository.findOne({loanId});
        if(!loan) throw new NotFoundError(`Loan ${loanId} does not exist`,{loanId});
        const paidEmis=await this.emiRepository.findAll({loanId,status:'Paid'});
        const transactions=await this.transactionRepository.findAll({loanId,status:'Success'});
        const emiHistory=paidEmis.map(emi=>{
            const transaction=transactions.find(t=>t.emiId.equals(emi._id));
            return {
                emiNumber: emi.emiNumber,
              dueDate: emi.dueDate,
              principal: emi.principal,
              interest: emi.interest,
              amount: emi.amount,
              status: 'Paid',
              paymentDate: transaction?.createdAt,
              lateFee: transaction?.lateFee || 0,
              totalPaid: transaction?.amount || 0
            };
            
        })
        if (loan.status !== 'Completed') {
            const nextEmiNumber = loan.paidEmis + 1;
            emiHistory.push({
                emiNumber: nextEmiNumber,
                dueDate: loan.nextEmiDate,
                principal: loan.emiAmount - (loan.remainingPrincipal * (loan.interestRate / 100) / 12),
                interest: (loan.remainingPrincipal * (loan.interestRate / 100) / 12),
                amount: loan.emiAmount,
                status: 'Pending',
                canPay: true
            });
        }
        return emiHistory;
    }

}

EMIService._dependencies =[ 'loanRepository','emiRepository','transactionRepository' ];

module.exports = EMIService;

