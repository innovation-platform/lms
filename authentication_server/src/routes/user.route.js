const express= require('express');
const {expressx} = require('ca-webutils');
const userController = require('../controllers/user.controller')
const {authenticate,authorize} = require('ca-webutils/jwt');


const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = userController();
           
    router
        .route('/')
        .get(authorize('admin','root'),routeHandler(controller.getAllUsers))
        .post(routeHandler(controller.registerUser))
       
    router
        .route('/signin')
        .post(routeHandler(controller.login));

    router
        .route("/activate")
        .patch(authorize('admin'),routeHandler(controller.activateUser));

    router
        .route("/deactivate")
        .patch(authorize('admin'),routeHandler(controller.deactivateUser));

    router
        .route('/current')
        .get(authenticate,routeHandler(controller.currentUserInfo))

    router
        .route('/forgotPassword')
        .post(routeHandler(controller.forgotPassword))

    router
        .route('/validateOtp')
        .post(routeHandler(controller.validateOtp))

    router
        .route('/resetPassword')
        .post(routeHandler(controller.resetPassword))

    router
        .route('/resendOtp')
        .post(routeHandler(controller.resetOtp))
    
    router
        .route('/addRole')
        .post(routeHandler(controller.addRole))
    
    router
        .route('/update')
        .patch(authenticate,routeHandler(controller.updateProfile))
    router
        .route('/change-password')
        .patch(authenticate,routeHandler(controller.changePassword))
    return router;

}


module.exports= createRouter;