const express= require('express');
const {expressx} = require('ca-webutils');
const emiController = require('../controllers/emi.controller')
const {authenticate,authorize} = require('ca-webutils/jwt');

const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = emiController();
        
    router
        .route('/pay')
        .patch(authorize('user'),routeHandler(controller.processEMIPayment))
       
    router
        .route('/history/:loanId')
        .get(authorize('user','banker','admin'),routeHandler(controller.getEMIHistory));

    return router;

}


module.exports= createRouter;