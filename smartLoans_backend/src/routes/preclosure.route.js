const express= require('express');
const {expressx} = require('ca-webutils');
const preclosureController = require('../controllers/preclosure.controller')


const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = preclosureController();
        
    router
        .route('/:loanId')
        .get(routeHandler(controller.getPreclosureDetails))
        .post(routeHandler(controller.processPreclosurePayment));


    return router;

}


module.exports= createRouter;