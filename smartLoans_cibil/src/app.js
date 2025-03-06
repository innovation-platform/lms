const express = require('express');
const cibilRoutes = require('./routes/cibil.route')
const cors=require('cors');
const fs=require('fs');
const path=require('path');
const { tokenDecorder } = require('ca-webutils/jwt');
const public_key = fs.readFileSync(path.join(process.cwd(),'keys', 'jwt.public.key'), 'utf8');
async function createApp(){

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(tokenDecorder(public_key, {algorithms: ['RS256']}));
    app.use('/api/cibil/', cibilRoutes());

    return app;
}

module.exports = createApp;