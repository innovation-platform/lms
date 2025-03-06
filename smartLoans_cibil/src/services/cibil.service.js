const { NotFoundError, ValidationError, AuthenticationError,AuthorizationError } = require("ca-webutils/errors");

class CibilService{
    constructor(cibilRepository){
        this.cibilRepository = cibilRepository;
    }

    async getCibilScore(panNumber){
        if(!panNumber){
            throw new ValidationError('Missing PAN Number');
        }
        const cibilData=await this.cibilRepository.findOne({panNumber});
        return cibilData || {cibil_score:700};

    }

    async updateCibilScore({ panNumber, daysLate }) {
        if (!panNumber) {
            throw new ValidationError('Missing PAN Number');
        }
        if (daysLate === undefined) {
            throw new ValidationError('Missing days late');
        }

        const cibilData = await this.cibilRepository.findOne({ panNumber });
        if (!cibilData) {
            throw new NotFoundError('CIBIL data not found');
        }

        // Update the CIBIL score based on the number of days the payment is late
        let scoreDeduction = 0;
        if (daysLate > 0 && daysLate <= 30) {
            scoreDeduction = 10;
        } else if (daysLate > 30 && daysLate <= 60) {
            scoreDeduction = 20;
        } else if (daysLate > 60) {
            scoreDeduction = 50;
        }

        cibilData.score -= scoreDeduction;
        await this.cibilRepository.update({ panNumber }, cibilData);

        return cibilData;
    }

    
}

CibilService._dependencies =[ 'cibilRepository' ];

module.exports = CibilService;

