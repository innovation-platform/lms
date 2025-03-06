const { NotFoundError, ValidationError, AuthenticationError, AuthorizationError } = require("ca-webutils/errors");
const { sendMail } = require("../utils/emailUtil");

class PreclosureService {
    constructor(loanRepository,transactionRepository) {
        this.loanRepository = loanRepository;
        this.transactionRepository = transactionRepository;
    }

    async getPreclosureDetails(loanId ) {
        const loan = await this.loanRepository.findOne({ loanId });
        if (!loan) throw new NotFoundError(`Loan ${loanId} does not exist`, { loanId });
        const outstandingAmount = loan.remainingPrincipal;
        const interestSavings = loan.interestAmount - (outstandingAmount * loan.interestRate / 100) || 0;
        const preclosureDetails = {
            outstandingAmount,
            amount: outstandingAmount,
            interestSavings,
            dueDate: loan.nextEmiDate
        };
        console.log(preclosureDetails);
        return preclosureDetails;
    }

    async processPreclosurePayment(loanId,{amount,paymentMethod,paymentDetails}) {
        
        const loan=await this.loanRepository.findOne({loanId});
        if(!loan) throw new NotFoundError(`Loan ${loanId} does not exist`,{loanId});
        const transaction = await this.transactionRepository.create({
            loanId,
            amount,
            paymentMethod,
            paymentDetails,
            status: 'Success'
        });
        loan.status = 'Completed';
      loan.remainingPrincipal = 0;
      loan.lastPaymentDate = new Date();
      loan.preclosureDate = new Date();
      loan.preclosureAmount = amount;
      const paymentResponse = {
        transactionId: transaction._id,
        paymentMethod: paymentMethod,
        paymentDetails: paymentDetails,
        amount: amount,
        status: 'Success',
        lateFee: 0,
        totalPaid: amount,
        paymentDate: new Date()
      }
      await loan.save();
      await sendMail(loan.email, 'Loan Preclosure', `Your loan of amount ${loan.loanAmount} has been preclosed. Your preclosure amount is ${amount}.`);
      return {
        success: true,
        message: 'Preclosure completed successfully',
        transactionDetails: paymentResponse,
        loanStatus: {
          status: loan.status,
          preclosureDate: loan.preclosureDate,
          preclosureAmount: loan.preclosureAmount
        }
      };

    }

}
PreclosureService._dependencies = ['loanRepository','transactionRepository'];

module.exports = PreclosureService;

