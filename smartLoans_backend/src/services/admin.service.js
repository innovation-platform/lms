const { NotFoundError, ValidationError, AuthenticationError,AuthorizationError } = require("ca-webutils/errors");
const axios=require('axios')
class AdminService{
    constructor(loanRepository){
        this.loanRepository = loanRepository;
    }

    async getAllLoans() {
        const loans = await this.loanRepository.findAll();
        return loans;
    }
}

AdminService._dependencies=['loanRepository'];

module.exports = AdminService;

