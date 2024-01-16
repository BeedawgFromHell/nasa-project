import launchesModel from '../../models/launches.model'
import { getPagination } from '../../services/query'

export async function httpGetAllLaunches(req, resp) {
    const { skip, limit } = getPagination( req.query.limit, req.query.page)

    return resp.json(await launchesModel.getAllLaunches(skip, limit))
}

export async function httpPostNewLaunch(req, resp) {
    const launch = req.body

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return resp.status(400).json({
            error: 'Missing required field'
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return resp.status(400).json({
            error: 'Invalid launch date'
        })
    }

    await launchesModel.scheduleNewLaunch(launch)
    return resp.status(201).json(launch)
}

export async function httpDeleteLaunch(req, resp) {
    const launchId = +req.params.id

    const existLaunch = await launchesModel.existLaunchWithId(launchId)
    if (!existLaunch) {
        return resp.status(404).json({
            error: "Launch with given id not found"
        })
    }

    const aborted = await launchesModel.abortLaunchWithId(launchId)

    if (!aborted) {
        return resp.status(400).json({
            error: 'Launch not aborted'
        })
    }

    return resp.status(200).json({
        ok: true
    })
}

