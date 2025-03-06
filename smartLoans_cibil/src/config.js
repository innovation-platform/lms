const { injector } = require('ca-webutils')

const MongooseCibilRepository = require('./repositories/mongoose/cibil.repository');
const CibilService = require('./services/cibil.service');
const Cibil=require('./repositories/mongoose/models/cibil.model');


injector
    .addServiceObject('cibil', Cibil)
    .addService('cibilRepository', MongooseCibilRepository)
    .addService('cibilService', CibilService)

console.log('injector.container',injector.container);
