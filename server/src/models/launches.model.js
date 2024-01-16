import launches from './launches.mongo'
import planets from './planets.mongo'

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration IV',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}

saveLaunch(launch)

async function existLaunchWithId(id) {
    const launch = await launches.findOne({
        flightNumber: id
    })

    return launch
}

async function getAllLaunches() {
    return await launches.find({}, {
        '__id': 0, '__v': 0
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne().sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if (!planet) {
        throw new Error('No matching planet was found')
    }

    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'Kydaibergen'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch)
}

async function abortLaunchWithId(id) {
    const aborted = await launches.updateOne({
        flightNumber: id
    }, {
        upcoming: false,
        success: false
    })

    console

    return aborted.modifiedCount === 1
}

export default {
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchWithId,
}