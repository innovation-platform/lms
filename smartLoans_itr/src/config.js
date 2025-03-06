const { injector,expressx,jwt } = require('ca-webutils')

const ITR = require('./repositories/mongoose/models/itr.model')
const MongooseITRRepository = require('./repositories/mongoose/itr.repository');
const ITRService = require('./services/itr.service');


injector
    .addServiceObject('itr',ITR)
    .addService('itrRepository', MongooseITRRepository)
    .addService('itrService',ITRService)
//console.log('injector.container',injector.container);

        
expressx.addCustomError('MongoServerError',400);