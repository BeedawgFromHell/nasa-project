import axios from 'axios'

import launches from './launches.mongo'
import planets from './planets.mongo'

const DEFAULT_FLIGHT_NUMBER = 100
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function populateLaunches() {
    console.log("Downloading launches data from spacex-api")

    const response = await axios.create({
        timeout: 60000,
    }).post(
        SPACEX_API_URL,
        {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path: "rocket",
                        select: {
                            "name": 1
                        }
                    },
                    {
                        path: "payloads",
                        select: {
                            customers: 1
                        }
                    }
                ],
            }
        }
    )

    if (response.status !== 200) {
        console.log("Problem downloading launch data");
        throw new Error("Launch data download failed")
    }

    const launchDocs = response.data.docs

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc["payloads"]
        const customers = payloads.flatMap(payload => {
            return payload["customers"]
        })

        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            customers,
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"]
        }

        await saveLaunch(launch)

        console.log(`${launch.flightNumber} ${launch.mission}`)
    }
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch(
        {
            flightNumber: 1,
            rocket: "Falcon 1",
            mission: "FalconSat"
        }
    )

    if (firstLaunch) {
        console.log("Launch data is already loaded, skipping...")
        return
    } else {
        await populateLaunches()
    }
}

async function findLaunch(filter) {
    return await launches.findOne(filter)
}

async function existLaunchWithId(id) {
    const launch = await findLaunch({
        flightNumber: id
    })

    return launch
}

async function getAllLaunches(skip, limit) {
    return await launches.find({}, {
        '__id': 0, '__v': 0
    })
        .sort({
            flightNumber: "asc"
        })
        .skip(skip)
        .limit(limit)
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne().sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

async function saveLaunch(launch) {
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if (!planet) {
        throw new Error('No matching planet was found')
    }


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
    loadLaunchesData
}