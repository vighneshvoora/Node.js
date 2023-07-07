const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/login_signup',(req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/cart',(req, res) => {
    res.sendFile(__dirname + '/cart.html');
})

app.get('/order_history',(req, res) => {
    res.sendFile(__dirname + '/order_history.html');
})

app.get('/script',(req, res) => {
    res.sendFile(__dirname + '/script.js');
})


let db;

MongoClient.connect('mongodb+srv://vighneshvoora17:<password>@cluster0.ngitwx4.mongodb.net/?retryWrites=true&w=majority').then((client) => {
    console.log("connected to DB server");
    db = client.db('food-delivery-db');
}).catch((err) => {
    console.log(err);
})

app.post('/signup', async (req, res) => {
    const { fullName, email, contact, password, add } = req.body;
    if (!fullName || !email || !contact || !password || !add) {
        res.json({ message: "please enter valid details" });
        return;
    } else {
        const result = await db.collection('user-cred').find({ email }).toArray();
        if (result.length) {
            res.json({ message: "user is already exist" });
            return;
        }
        const user = { fullName, email, contact, password, add };
        await db.collection('user-cred').insertOne(user);
        res.json({ message: "user created successfully" });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const result = await db.collection('user-cred').find({ email }).toArray();
        if (result.length) {
            if (result[0].password == password) {
                res.json({ message: 'login successful' });
            } else {
                res.json({ message: 'Invalid password' });
            }
        } else {
            res.json({ message: 'user doesn\'t exist' });
        }
    } else {
        res.json({ message: "Invalid email or password" });
    }
});

app.post('/forgotPassword', async (req, res) => {
    const { email, phoneNumber, newPassword } = req.body;
    // email -> is exist in cred.json, phoneNumber is == that existing user, oldPassword = newPassword
    if (email && phoneNumber && newPassword) {
        const result = await db.collection('user-cred').find({ email }).toArray();
        if (result.length) {
            if (result[0].contact == phoneNumber) {
                await db.collection('user-cred').updateOne({ email }, { $set: { password: newPassword } });
                res.json({ message: 'password updated successfully' });
            } else {
                res.json({ message: 'incorrect phone no' });
            }
        } else {
            res.json({ message: 'user doesn\'t exist' });
        }
    } else {
        res.json({ message: "Invalid phone number or email" });
    }
})

app.post('/addRestaurant', async (req, res) => {
    const restoDetails = req.body;
    if (restoDetails) {
        await db.collection('restaurant').insertOne(restoDetails);
        res.json({ message: 'restaurant details added in DB' });
    } else {
        res.json({ message: 'restaurant details is Empty' });
    }
})

app.get('/getRestaurant', async (req, res) => {
    const { location, food, id } = req.query;
    const result = await db.collection('restaurant').find({}).toArray();
    console.log(result);
    let data = [];
    if (result.length) {
        if (location) {
            result.forEach(eachResto => {
                if (eachResto.details.address == location) {
                    data.push(eachResto);
                }
            });
            res.json({ message: 'All the Restaurant', data });
        } else if (food) {
            result.forEach(eachResto => {
                // eachResto.foodItems["veg"].forEach((foodItem) => {
                //     if (foodItem.name == food) {
                //         data.push(eachResto);
                //     }
                // });
                // eachResto.foodItems["non-veg"].forEach((foodItem) => {
                //     if (foodItem.name == food) {
                //         data.push(eachResto);
                //     }
                // });
                for (const key in eachResto.foodItems) {
                    eachResto.foodItems[`${key}`].forEach((foodItem) => {
                        if (foodItem.name == food) {
                            data.push(eachResto);
                        }
                    });
                }
            });
            res.json({ message: 'All the Restaurant', data });
        } else if (id) {
            result.forEach(eachResto => {
                const resto_id = (eachResto._id).toString();
                if (id == resto_id) {
                    data.push(eachResto);
                }
            })
            res.json({ message: 'All the Restaurant', data });
        } else {
            res.json({ message: 'All the Restaurant', result });
        }
    } else {
        res.json({ message: 'No Any Restaurant available' });
    }
})

// we have to add -> orderedOn:Date.now()
app.post('/addOrder', async (req, res) => {
    const orderDetails = req.body;
    let totalPrice = 0;
    orderDetails.cart.forEach(orders => totalPrice += orders.totalPrice);
    if (orderDetails) {
        const order = {
            ...orderDetails,
            orderedOn: Date.now(),
            orderStatus: 'ORDER_PLACED',
            totalPrice,
        };
        let result = await db.collection('orders').insertOne(order);
        const OrderId = result.insertedId.toString();
        res.json({ message: `Order placed successfully, Your OrderId is ${OrderId}` });
    } else {
        res.json({ message: 'please add food in cart' })
    }
});

app.get('/getOrders', async (req, res) => {
    const { email } = req.query;
    const result = await db.collection('orders').find({ email }).sort({ orderedOn: -1 }).toArray();
    res.json({ message: result });
})

const port = 3001;
app.listen(port, () => {
    console.log(`server is running in port ${port}`);
});