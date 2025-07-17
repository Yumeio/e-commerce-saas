import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';
import { ErrorMiddleware } from "../../../packages/libs/src/errors"

const app: Express = express();

app.use(cors(
    {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 200,
    }
))
app.use(helmet());
app.use(morgan("dev"))
app.use(express.json(
    {
        limit: '100mb',
    }
));
app.use(express.urlencoded(
    {
        extended: true,
        limit: '100mb',
    }
));
app.use(cookieParser());
app.set('trust proxy', 1); // Trust first proxy for rate limiting
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req: any) => (req.user ? 1000 : 100), // 1000 requests for authenticated users, 100 for unauthenticated
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: true, // Enable the `X-RateLimit-*` headers
    message: {
        status: 429,
        error: 'Too many requests, please try again later.',
    },
    skip: (req: any) => req.user && req.user.isAdmin, // Skip rate limiting for admin users
    keyGenerator: (req: any) => req.user ? req.user.id : req.ip, // Use user ID for authenticated users, IP for others
}));
app.use("/", proxy("http://localhost:6001"))
app.use(ErrorMiddleware);

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the API-Gateway Service',
    });
});

export { app };
