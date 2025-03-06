const express = require('express');
const bankerRoutes=require('./routes/banker.route')
const emiRoutes=require('./routes/emi.route')
const preclosureRoutes=require('./routes/preclosure.route')
const loanRoutes=require('./routes/loan.route');
const path = require('path');
const fs = require('fs');
const cors=require('cors');
const { tokenDecorder } = require('ca-webutils/jwt');

const public_key = fs.readFileSync(path.join(process.cwd(),'keys', 'jwt.public.key'));

async function createApp(){

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(process.cwd(), 'public')))
    app.use(tokenDecorder(public_key, {algorithms: ['RS256']}));

    app.use('/api/banker/', bankerRoutes());
    app.use('/api/emi/', emiRoutes());
    app.use('/api/preclosure/', preclosureRoutes());
    app.use('/api/loan/', loanRoutes());
    return app;
}

module.exports = createApp;