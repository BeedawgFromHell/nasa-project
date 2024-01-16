import * as http from 'http';
// import dotenv from 'dotenv';
// dotenv.config();

import * as mongo from './services/mongo';
import { app } from './app';
import { loadPlanets } from './models/planets.model';
import launchesModel from './models/launches.model';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await mongo.mongoConnect();;
    await loadPlanets();
    await launchesModel.loadLaunchesData();

    server.listen(PORT, () => {
        console.log("Server listening on: ", PORT);
    })
}

startServer();