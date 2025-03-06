const {injector} = require('ca-webutils')


const emiController = ()=>{
    
    const emiService = injector.getService('emiService');
    
    const processEMIPayment = ({body})=> emiService.processEMIPayment(body);
    
    const getEMIHistory = ({loanId})=> emiService.getEMIHistory(loanId);
    
    return {
        processEMIPayment,
        getEMIHistory
    }
}

module.exports = emiController;

