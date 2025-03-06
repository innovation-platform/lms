const express= require('express');
const {expressx} = require('ca-webutils');
const bankerController = require('../controllers/banker.controller')
const {authenticate,authorize} = require('ca-webutils/jwt');

const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = bankerController();
        
    router
        .route('/loans')
        .get(authorize('banker','admin'),routeHandler(controller.getAllLoans))
       
    router
        .route('/approve')
        .patch(authorize('banker','admin'),routeHandler(controller.approveLoan));

    router
        .route('/reject')
        .patch(authorize('banker','admin'),routeHandler(controller.rejectLoan));

    router
        .route('/scores')
        .patch(authorize('banker','admin'),routeHandler(controller.updateScores));

    return router;

}


module.exports= createRouter;