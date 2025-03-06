const {injector} = require('ca-webutils');
const { AuthenticationError } = require('ca-webutils/errors');
const fs = require('fs');

const path = require('path');
const privateKey = fs.readFileSync(path.join(process.cwd(),'keys','jwt.private.key'),'utf-8');


const userController = ()=>{
    
    const userService = injector.getService('userService');
    const jwt = injector.getService('jwt');
    
    const getAllUsers = ()=> userService.getAllUsers();

    const activateUser= (({body})=> userService.activateUser(body))

    const deactivateUser=(({body})=>userService.deactivateUser(body))
    const registerUser = ({body})=> userService.register(body);
    
    const login = async ({body})=>{

        let user = await userService.login(body);
       let token = await jwt.createToken(user,privateKey,{algorithm: 'RS256'},body.claims);
       return {token,user}

    }
    const addRole=async ({body})=>await userService.addUserToRole(body);

    const validateOtp=async({body})=>await userService.validateOtp(body);
    const resetPassword=async({body})=>await userService.resetPassword(body);
    const resetOtp=async({body})=>await userService.resetOtp(body);
    const updateProfile=async({body})=>{
        let user=await userService.updateProfile(body);
       let token = await jwt.createToken(user,privateKey,{algorithm: 'RS256'},body.claims);
       return {token,user}
    }
    const changePassword=async({body})=>await userService.changePassword(body);
    const currentUserInfo = async ({request})=>{        
        return request.token;
    }
    const forgotPassword=async({body})=>{
        return userService.forgotPassword(body);
    }
    return {
        getAllUsers,
        registerUser,
        login,
        activateUser,
        currentUserInfo,
        forgotPassword,
        validateOtp,
        resetPassword,
        resetOtp,
        addRole,
        updateProfile,
        changePassword,
        deactivateUser
    }
}

module.exports = userController;

