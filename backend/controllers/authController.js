// import jwt from 'jsonwebtoken';
// import stripe from '../config/stripe.js';

// // Function to set token
// export const setToken = (req, res) => {
//     const user = req.body;
//     const token = jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '24h' });
//     res.send({ token });
// };

// // Function to create payment intent
// export const createPaymentIntent = async (req, res) => {
//     const { price } = req.body;
//     const amount = parseInt(price) * 100;
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: 'usd',
//         payment_method_types: ['card']
//     });
//     res.send({
//         clientSecret: paymentIntent.client_secret
//     });
// };
