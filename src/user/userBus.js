import * as express from 'express';
import { busAvailable } from './userBusGet.js';

const userBusRouter = express.Router();

userBusRouter.get('/available', async(req, res) => {
    const ans = await busAvailable(req.query.date, req.query.startTime, req.query.endTime, req.query.busId);
    res.json(ans);
});

export {userBusRouter};