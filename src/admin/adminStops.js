import * as express from 'express';
import { StopModel } from '../db/db.providers.js';

const adminStopsRouter = express.Router();

adminStopsRouter.get('/', async (req, res) => {
    const stops = await StopModel.findAll({
        where: req.query,
    });
    res.json(stops);
});

adminStopsRouter.post('/', async (req, res) => {
    const newStop = await StopModel.create(req.body);
    res.json(newStop);
});

adminStopsRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const stop = await StopModel.findByPk(id);
    res.json(stop);
});

adminStopsRouter.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const [updatedRowsCount, updatedRows] = await StopModel.update(req.body, {
        where: { id: id },
        returning: true,
    });
    if(updatedRowsCount>0)      res.json(updatedRows[0]);
    else                        res.status(404).json({error: "Bus Not Found"});
});

adminStopsRouter.delete('/:id', async (req,res) => {
    const id = req.params.id;
    const deleted = await StopModel.destroy({
        where: { id: id },
    });
    res.json(deleted);
});

export {adminStopsRouter};