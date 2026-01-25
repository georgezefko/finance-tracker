import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { z } from 'zod';

import cashflowRoutes from './modules/cashflow/cashflow.routes';
import authRoutes from './modules/auth/auth.routes';
import networthRoutes from './modules/networth/networth.routes'

const port = process.env.PORT || 8000

const app: Express = express();

app.use(cors({
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use('/api/auth', authRoutes);
app.use('/api/cashflow', cashflowRoutes);
app.use('/api/networth', networthRoutes);

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);

    if (error instanceof z.ZodError) {
        res.status(422).json({ 
            message: 'Validation failed.',
            errors: error.errors 
        });
        return;
    }
    
    const status = error.statusCode || 500;
    const message = error.message || 'An internal server error occurred.';
    res.status(status).json({ message: message });
    return;
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
