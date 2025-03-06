const {injector} = require('ca-webutils')


const preclosureController = ()=>{
    
    const preclosureService = injector.getService('preclosureService');
    
    const getPreclosureDetails = ({loanId})=> preclosureService.getPreclosureDetails(loanId);
    
    const processPreclosurePayment = ({loanId,body})=> preclosureService.processPreclosurePayment(loanId,body);
    

    return {
        getPreclosureDetails,
        processPreclosurePayment
    }
}

module.exports = preclosureController;

