import * as express from 'express';

import { planetsRouter } from './planets/planets.route';
import { launchesRouter } from './launches/launches.route';

export const api = express.Router();

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);
