const {injector} = require('ca-webutils')


const adminController = ()=>{
    
    const adminService = injector.getService('adminService');

    //Loans

    const getAllLoans =()=>adminService.getAllLoans();
    const deleteLoan =({id})=> adminService.deleteLoan(id);

    //

    return {
        getAllLoans,
        deleteLoan
    }
}

module.exports = adminController;

