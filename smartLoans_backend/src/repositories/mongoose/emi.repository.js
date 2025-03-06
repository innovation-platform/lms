const {MongooseRepository} = require('ca-webutils')

class MongooseEMIRepository extends MongooseRepository {
    constructor(model){
        super(model);
        console.log('model',model.constructor.name);
        
    }
}

MongooseEMIRepository._dependencies =['emi']

module.exports = MongooseEMIRepository;
