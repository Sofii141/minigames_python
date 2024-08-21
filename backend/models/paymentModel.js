// import mongoose from 'mongoose';

// // Define el esquema para los pagos
// const paymentSchema = new mongoose.Schema({
//     userEmail: {
//         type: String,
//         required: true,
//     },
//     classesId: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Class',
//         required: true,
//     }],
//     transactionId: {
//         type: String,
//         required: true,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
// });

// // Crea un modelo a partir del esquema
// const Payment = mongoose.model('Payment', paymentSchema);

// export default Payment;
