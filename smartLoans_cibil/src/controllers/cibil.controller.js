const {injector} = require('ca-webutils')


const cibilController = ()=>{
    
    const cibilService = injector.getService('cibilService');
    
    const getCibilScore = ({panNumber})=> cibilService.getCibilScore(panNumber);
    
    const updateCibil = ({id})=> userService.updateCibil(id);
    

    return {
        getCibilScore,
        updateCibil
    }
}

module.exports = cibilController;

