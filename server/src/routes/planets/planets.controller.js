import {getAllPlanets} from '../../models/planets.model'

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
export async function httpGetAllPlanets(req, res) {
    return res.status(200).json(await getAllPlanets())
}
