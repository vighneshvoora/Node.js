const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const credentialsList = []
app.post('/signup', (req, res) => {
    const { fullName, email, password, phoneNumber, add } = req.body;

    console.log(fullName, email, password, phoneNumber, add);
    if (!fullName || !email || !phoneNumber || !password || !add) {
        res.json({ message: "please enter valid cred" });
        return;
    }
    for (let i = 0; i < credentialsList.length; i++) {
        if (credentialsList[i].email == email) {
            res.json({ message: "user already exist" });
            return;
        }
    }
    credentialsList.push({ fullName, email, phoneNumber, password, add });
    console.log(credentialsList);
    res.json({ message: "user created successfully" });
});


app.listen(3001, () => {
    console.log("server is running in 3001 port");
})