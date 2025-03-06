const {MongooseRepository} = require('ca-webutils')

class MongooseLoanRepository extends MongooseRepository {
    constructor(model){
        super(model);
        console.log('model',model.constructor.name);
        
    }
}

MongooseLoanRepository._dependencies =['loan']

module.exports = MongooseLoanRepository;
