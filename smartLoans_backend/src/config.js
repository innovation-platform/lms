const { injector } = require('ca-webutils')

// const User = require('./repositories/mongoose/models/user.model')
// const MongooseUserRepository = require('./repositories/mongoose/user.repository');
// const UserService = require('./services/user.service');
const EMI = require('./repositories/mongoose/models/emi.model')
const MongooseEMIRepository = require('./repositories/mongoose/emi.repository');
const EMIService = require('./services/emi.service');
const Transactions = require('./repositories/mongoose/models/transaction.model')
const MongooseTransactionRepository = require('./repositories/mongoose/transaction.repository');
const Loan = require('./repositories/mongoose/models/loan.model')
const MongooseLoanRepository = require('./repositories/mongoose/loan.repository');
const BankerService = require('./services/banker.service');
const PreclosureService = require('./services/preclosure.service');
const LoanService = require('./services/loan.service');



injector
    .addServiceObject('emi', EMI)
    .addServiceObject('transaction', Transactions)
    .addServiceObject('loan', Loan)
    .addService('emiRepository', MongooseEMIRepository)
    .addService('transactionRepository', MongooseTransactionRepository)
    .addService('loanRepository', MongooseLoanRepository)
    .addService('bankerService', BankerService)
    .addService('emiService', EMIService)
    .addService('preclosureService', PreclosureService)
    .addService('loanService', LoanService)

console.log('injector.container',injector.container);
