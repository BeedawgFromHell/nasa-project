import * as http from 'http';
import * as mongo from './services/mongo';

import { app } from './app';
import { loadPlanets } from './models/planets.model';

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
    await mongo.mongoConnect()
    await loadPlanets()

    server.listen(PORT, () => {
        console.log("Server listening on: ", PORT)
    })
}

startServer()