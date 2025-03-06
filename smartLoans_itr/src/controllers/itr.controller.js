const {injector} = require('ca-webutils');
const { AuthenticationError } = require('ca-webutils/errors');

const itrController = ()=>{
    
    const itrService = injector.getService('itrService');
    
    const getITR = ({panNumber})=>{
        console.log(`panNumber: ${panNumber}`);
        return itrService.getITR(panNumber);
    }



    return {
        getITR
    }
}

module.exports = itrController;

