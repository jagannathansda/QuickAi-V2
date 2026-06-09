import express from 'express'; 
import cors from 'cors'; //connect backend to any frontend
import 'dotenv/config'; //we can use environment variable in backend
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();

await connectCloudinary();

// app.use(cors({ origin: 'http://localhost:5173' })); //all the request will be passed through this cors
app.use(cors());
app.use(express.json()); //all the request will be passed through json
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Server is live'));

app.use(requireAuth()); // only logedin user can get proceed

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 5000; //if the port is present in environment variable otherwise the port will be 5000;

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});

