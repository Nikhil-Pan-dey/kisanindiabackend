import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
// import colors from 'colors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddlware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';

dotenv.config();

// Database connection
connectDB();

const app = express();

// CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Morgan logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// JSON body parsing
app.use(express.json());

// API routes
app.use('/api/products', productRoutes);//this end point was /api only
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/supplier', supplierRoutes);

// PayPal configuration
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

// Static uploads folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Production mode static assets handling
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
