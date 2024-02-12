import express from 'express';
const app = express();
const port = 8000;

app.get('/',(req,res)=>{
    res.send('Hello boys')
})

app.listen(port,(req,res)=>{
    console.log(`server is running at port ${port}`)
})