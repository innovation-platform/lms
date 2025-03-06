const express= require('express');
const {expressx} = require('ca-webutils');
const loanController = require('../controllers/loan.controller')
const {authenticate,authorize} = require('ca-webutils/jwt');

const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = loanController();
    
    router
        .route('/')
        .get(routeHandler(controller.getAllLoans));
    router
        .route('/apply_loan')
        .post(controller.uploadMiddleware,routeHandler(controller.applyLoan));


    return router;
}


module.exports= createRouter;