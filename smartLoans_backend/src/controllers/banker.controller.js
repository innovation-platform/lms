const {injector} = require('ca-webutils')


const bankerController = ()=>{
    
    const bankerService = injector.getService('bankerService');
    
    const getAllLoans = ()=> bankerService.getAllLoans();
    
    const approveLoan = ({body})=> bankerService.approveLoan(body);
    
    const rejectLoan = ({body})=> bankerService.rejectLoan(body);
    
    const updateScores = ({body})=> bankerService.updateScores(body);

    return {
        getAllLoans,
        approveLoan,
        rejectLoan,
        updateScores
    }
}

module.exports = bankerController;

