import request from 'supertest'
import { mongoConnect, mongoDisconnect } from '../../services/mongo'
import { loadPlanets } from '../../models/planets.model'
import { app } from '../../app'


describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect()
        await loadPlanets()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Get launches', () => {
        test('Should return 200', async () => {
            await request(app).get('/v1/launches').expect('Content-Type', /json/).expect(200)
        })
    })

    describe('Post launch', () => {
        const launchCompleteData = {
            mission: 'KG 101 Exploration',
            rocket: 'Aliance 205',
            target: 'Kepler-442 b',
            launchDate: 'January 27, 2030'
        }
        const launchWithoutDate = {
            mission: 'KG 101 Exploration',
            rocket: 'Aliance 205',
            target: 'Kepler-442 b',
        }
        const launchWithInvalidDate = {
            mission: 'KG 101 Exploration',
            rocket: 'Aliance 205',
            target: 'Kepler-442 b',
            launchDate: 'asdasd',
        }


        test('Should return 201', async () => {
            const resp = await request(app).post('/v1/launches').send(launchCompleteData).expect('Content-Type', /json/).expect(201)

            const requestDate = new Date(launchCompleteData.launchDate).valueOf()
            const responseDate = new Date(resp.body.launchDate).valueOf()

            expect(requestDate).toBe(responseDate)

            expect(resp.body).toMatchObject(launchWithoutDate)
        })



        test('Should return 400 with missing required fields', async () => {
            const resp = await request(app).post('/v1/launches').send(launchWithoutDate).expect('Content-Type', /json/).expect(400)

            expect(resp.body).toStrictEqual(
                {
                    error: 'Missing required field'
                }
            )
        })

        test('Should return 400 with missing dates', async () => {
            const resp = await request(app).post('/v1/launches').send(launchWithInvalidDate).expect('Content-Type', /json/).expect(400)

            expect(resp.body).toStrictEqual(
                {
                    error: 'Invalid launch date'
                }
            )
        })
    })
})
