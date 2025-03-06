import {httpx,expressx} from 'ca-webutils';
import express from 'express';
import path from 'path';
const app=express();
app.use(express.static('./dist'));
 
app.get('*',(request,response)=>{
    response.send(path.join('./dist','index.html'));
 
})
httpx.runApp({
    requestHandler:app
})