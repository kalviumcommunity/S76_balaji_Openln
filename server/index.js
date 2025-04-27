import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { router as routes } from './routes.js'; // Fixed import

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));