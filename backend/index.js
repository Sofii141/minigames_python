import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

dotenv.config();
const stripe = new Stripe(process.env.PAYMENT_SECRET);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// SET TOKEN
const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'Unauthorize access' });
    }
    const token = authorization?.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: true, message: 'forbidden user or token has expired' });
        }
        req.decoded = decoded;
        next();
    });
};

// MONGO DB ROUTES
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();

        console.log('Conexión a MongoDB exitosa');

        const database = client.db("gymBD");
        console.log(`Conectado a la base de datos: ${database.databaseName}`);
        const userCollection = database.collection("users");
        const classesCollection = database.collection("classes");
        const cartCollection = database.collection("cart");
        const enrolledCollection = database.collection("enrolled");
        const paymentCollection = database.collection("payments");
        const appliedCollection = database.collection("applied");

        // Verify admin
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user.role === 'admin') {
                next();
            } else {
                return res.status(401).send({ error: true, message: 'Unauthorize access' });
            }
        };

        const verifyInstructor = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user.role === 'instructor' || user.role === 'admin') {
                next();
            } else {
                return res.status(401).send({ error: true, message: 'Unauthorize access' });
            }
        };

        app.post('/new-user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        app.post('/api/set-token', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '24h' });
            res.send({ token });
        });

        app.get('/users', async (req, res) => {
            const users = await userCollection.find({}).toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        app.get('/user/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.delete('/delete-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/update-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.option,
                    address: updatedUser.address,
                    phone: updatedUser.phone,
                    about: updatedUser.about,
                    photoUrl: updatedUser.photoUrl,
                    skills: updatedUser.skills ? updatedUser.skills : null,
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.post('/new-class', verifyJWT, verifyInstructor, async (req, res) => {
            const newClass = req.body;
            newClass.availableSeats = parseInt(newClass.availableSeats);
            const result = await classesCollection.insertOne(newClass);
            res.send(result);
        });

        app.get('/classes/:email', verifyJWT, verifyInstructor, async (req, res) => {
            const email = req.params.email;
            const query = { instructorEmail: email };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/classes', async (req, res) => {
            const query = { status: 'approved' };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/classes-manage', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        });

        app.put('/change-status/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const reason = req.body.reason;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: status,
                    reason: reason
                }
            };
            const result = await classesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.get('/approved-classes', async (req, res) => {
            const query = { status: 'approved' };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/instructors', async (req, res) => {
            const query = { role: 'instructor' };
            const result = await userCollection.find(query).toArray();
            res.send(result);
        });

        app.put('/update-class/:id', verifyJWT, verifyInstructor, async (req, res) => {
            const id = req.params.id;
            const updatedClass = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedClass.name,
                    description: updatedClass.description,
                    price: updatedClass.price,
                    availableSeats: updatedClass.availableSeats,
                    photoUrl: updatedClass.photoUrl,
                    category: updatedClass.category
                }
            };
            const result = await classesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.post('/enrolled', verifyJWT, async (req, res) => {
            const enrollment = req.body;
            const result = await enrolledCollection.insertOne(enrollment);
            res.send(result);
        });

        app.get('/enrolled', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await enrolledCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/cart', verifyJWT, async (req, res) => {
            const cartItem = req.body;
            const result = await cartCollection.insertOne(cartItem);
            res.send(result);
        });

        app.get('/cart', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        });

        app.delete('/delete-cart/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        });

        app.post('/create-payment-intent', verifyJWT, async (req, res) => {
            const { price } = req.body;
            const amount = price * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card'],
            });
            res.send({ clientSecret: paymentIntent.client_secret });
        });

        app.post('/payments', verifyJWT, async (req, res) => {
            const payment = req.body;
            const result = await paymentCollection.insertOne(payment);
            res.send(result);
        });

        app.post('/apply-coupon', verifyJWT, async (req, res) => {
            const coupon = req.body;
            const result = await appliedCollection.insertOne(coupon);
            res.send(result);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
