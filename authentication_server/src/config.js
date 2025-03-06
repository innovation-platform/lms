const { injector,expressx,jwt } = require('ca-webutils')

const User = require('./repositories/mongoose/models/user.model')
const MongooseUserRepository = require('./repositories/mongoose/user.repository');
const UserService = require('./services/user.service');
//const jwt = require('./services/jwt');
//console.log('User',User);


injector
    .addServiceObject('jwt',jwt)
    .addServiceObject('user', User)
    .addService('userRepository', MongooseUserRepository)
    .addService('userService', UserService)

//console.log('injector.container',injector.container);

        
expressx.addCustomError('MongoServerError',400);