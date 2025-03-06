const { MongooseRepository } = require('ca-webutils');

// Define NotFoundError directly in the repository file
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

class MongooseITRRepository extends MongooseRepository {
    constructor(model){
        super(model);
        //console.log('model',model.constructor.name);
    }

    async getById(email){
        let user = await this.model.findOne({ email });
        if (!user)
            throw new NotFoundError(`User with email ${email} not found`);
        return user;
    }
}

MongooseITRRepository._dependencies = ['itr'];

module.exports = MongooseITRRepository;
