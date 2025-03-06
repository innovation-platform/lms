const {MongooseRepository} = require('ca-webutils')

class MongooseCibilRepository extends MongooseRepository {
    constructor(model){
        super(model);
        console.log('model',model.constructor.name);
        
    }
    
}

MongooseCibilRepository._dependencies =['cibil']

module.exports = MongooseCibilRepository;
