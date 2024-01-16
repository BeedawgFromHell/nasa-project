import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';
import * as morgan from 'morgan';

import { api } from './routes/api';

export const app = express.default();

app.use(cors.default({
    origin: 'http://localhost:3000'
}))
app.use(morgan.default('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', api)

app.get('/*', (req, resp) => {
    resp.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
