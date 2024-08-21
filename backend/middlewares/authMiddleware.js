// import jwt from 'jsonwebtoken';
// import userCollection from '../models/userModel.js';

// // Middleware to verify JWT
// export const verifyJWT = (req, res, next) => {
//     const authorization = req.headers.authorization;
//     if (!authorization) {
//         return res.status(401).send({ error: true, message: 'Unauthorize access' });
//     }
//     const token = authorization.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ error: true, message: 'forbidden user or token has expired' });
//         }
//         req.decoded = decoded;
//         next();
//     });
// };

// // Middleware to verify admin
// export const verifyAdmin = async (req, res, next) => {
//     const email = req.decoded.email;
//     const user = await userCollection.findOne({ email: email });
//     if (user.role === 'admin') {
//         next();
//     } else {
//         return res.status(401).send({ error: true, message: 'Unauthorize access' });
//     }
// };

// // Middleware to verify instructor
// export const verifyInstructor = async (req, res, next) => {
//     const email = req.decoded.email;
//     const user = await userCollection.findOne({ email: email });
//     if (user.role === 'instructor' || user.role === 'admin') {
//         next();
//     } else {
//         return res.status(401).send({ error: true, message: 'Unauthorize access' });
//     }
// };
