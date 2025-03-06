const {MongooseRepository} = require('ca-webutils')

class MongooseTransactionRepository extends MongooseRepository {
    constructor(model){
        super(model);
        console.log('model',model.constructor.name);
        
    }
}

MongooseTransactionRepository._dependencies =['transaction']

module.exports = MongooseTransactionRepository;
