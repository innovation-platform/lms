const express= require('express');
const {expressx} = require('ca-webutils');
const cibilController = require('../controllers/cibil.controller')


const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = cibilController();
        
    router
        .route('/:panNumber')
        .get(routeHandler(controller.getCibilScore))
        .patch(routeHandler(controller.updateCibil))

    return router;

}


module.exports= createRouter;