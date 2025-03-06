const {injector} = require('ca-webutils')


const loanController = ()=>{
    
    const loanService = injector.getService('loanService');
    
    const getAllLoans = ({query})=> loanService.getLoansList(query);
    
    const applyLoan = ({request})=> {
        console.log("files",request.files);

        return loanService.applyLoan(request.body,request.files);
    }
    const uploadMiddleware=loanService.uploadMiddleware;

    return {
        getAllLoans,
        applyLoan,
        uploadMiddleware
    }
}

module.exports = loanController;

