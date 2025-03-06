const {MongooseRepository} = require('ca-webutils')
const {NotFoundError} =require('ca-webutils/errors')
class MongooseUserRepository extends MongooseRepository {
    constructor(model){
        super(model);
    }
    async getById(email){
        let user= await this.model.findOne({email});
        if(!user)
            throw new NotFoundError(`User with email ${email} not found`);
        return user;
    }
    async update(matcher, updater){
        return await this.model.updateOne(matcher, updater);
    }
}

MongooseUserRepository._dependencies =['user']

module.exports = MongooseUserRepository;
