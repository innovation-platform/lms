const express= require('express');
const {expressx} = require('ca-webutils');
const itrController = require('../controllers/itr.controller')
const {authenticate,authorize} = require('ca-webutils/jwt');


const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = itrController();
           
    router
        .route('/:panNumber')
        .get(routeHandler(controller.getITR))
    return router;

}


module.exports= createRouter;