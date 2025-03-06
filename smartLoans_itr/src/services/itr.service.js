const { NotFoundError, ValidationError, AuthenticationError,AuthorizationError } = require("ca-webutils/errors");

class ITRService{
    constructor(itrRepository){
        this.itrRepository = itrRepository;
    }

    async getITR(panNumber){
        console.log(`panNumber: ${panNumber}`);
        if(!panNumber) throw new ValidationError(`Pan Number is required`);
        const itrData=await this.itrRepository.findOne({panNumber});
        return itrData || {annualIncome:200000}; 
    }

}
ITRService._dependencies =[ 'itrRepository' ];

module.exports = ITRService;

