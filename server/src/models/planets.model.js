import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { fileURLToPath } from 'url';

import dirname from '../services/dirname'
import planets from './planets.mongo'


function isHabitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

//dirname(fileURLToPath(import.meta.url))
export function loadPlanets() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitable(data)) {
                    savePlanet(data)
                }
            })
            .on('error', (err) => {
                console.log(err)
                reject()
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length
                console.log(`${countPlanetsFound} habitable planets found`)
                resolve()
            })

    })
}

export async function getAllPlanets() {
    return await planets.find({}, {
        '__v': 0,
        '_id': 0,
    })
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true
        })
    } catch (err) {
        console.error(`Could not save planet: ${err}`)
    }

}

