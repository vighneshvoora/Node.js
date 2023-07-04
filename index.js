const express = require('express');
const cors = require('cors');
const app = express();

const credentialList = []
app.post('/signup', (req, res)=>{
    const { fullName, emailid, phoneNumber, password, address} = req.body;
    if(!fullName||!emailid||!password||!phoneNuumber||!address){
        res.send({
            message:"Please enter valid details"
        })
    }

    for (let i = 0; i < credentialList.length; i++) {
        if (credentialList[i].emailid == emailid) {
            res.json({message: "user already exists"});
            return;
        }
    }
    credentialList.push({fullName, emailid, password, phoneNumber, address});
    console.log(credentialList);
    res.json({message: "user created successfully"});

});


app.listen(3001, ()=>{
    console.log("server is running in 3001 port");
})