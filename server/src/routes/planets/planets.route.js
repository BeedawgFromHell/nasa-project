import express from 'express';
import {httpGetAllPlanets} from './planets.controller'

export const planetsRouter = express.Router()

planetsRouter.get('/',httpGetAllPlanets)
