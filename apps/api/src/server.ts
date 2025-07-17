import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app: Express = express();

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the API-Gateway Service',
    });
});

export { app };
