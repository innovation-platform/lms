const express = require('express');
const userRoutes = require('./routes/user.route')
const path = require('path');
const fs = require('fs');
const cors = require("cors");


const { tokenDecorder } = require('ca-webutils/jwt');

const public_key = fs.readFileSync(path.join(process.cwd(),'keys', 'jwt.public.key'), 'utf8');


async function createApp(){

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(process.cwd(), 'public')));

    app.use(tokenDecorder(public_key, {algorithms: ['RS256']}));
    // app.use((req, res, next) => {
    //     console.log("Received Token:", req.headers.authorization);
    //     next();
    // });
    

    // app.use((request,response,next)=>{
    //     console.log('request.user', request.user);   
    //     console.log('request.tokenError',request.tokenError?.message);
        
    //     next();
    // })

    app.use('/api/users/', userRoutes());

    return app;
}

module.exports = createApp;