import express from 'express'

import * as launchesController from './launches.controller'

export const launchesRouter = express.Router()

launchesRouter.get('/',launchesController.httpGetAllLaunches)
launchesRouter.post('/',launchesController.httpPostNewLaunch)
launchesRouter.delete('/:id', launchesController.httpDeleteLaunch)
 