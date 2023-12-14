import express, { Express } from 'express';
import bodyParser from 'body-parser';

import feedRoutes from './routes/feed';

const app: Express = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use('/feed', feedRoutes);

app.listen(8080);
