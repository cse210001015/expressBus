import * as express from 'express';
import { LocationModel } from '../db/db.providers.js';

const adminLocationsRouter = express.Router();

adminLocationsRouter.get('/',async (req,res) => {
    const locations = await LocationModel.findAll();
    res.json(locations);
});

adminLocationsRouter.post('/',async (req,res) => {
    const newLocation = await LocationModel.create(req.body);
    res.json(newLocation);
});

adminLocationsRouter.get('/:id', async (req,res) => {
    const id = req.params.id;
    const location = await LocationModel.findByPk(id);
    res.json(location);
});

adminLocationsRouter.patch('/:id', async (req,res) => {
    const id = req.params.id;
    const [updatedRowsCount, updatedRows] = await LocationModel.update(req.body,{
        where: { id: id },
        returning: true
    });
    if(updatedRowsCount>0)      res.json(updatedRows[0]);
    else                        res.status(404).json({error: "Bus Not Found"});
});

adminLocationsRouter.delete('/:id', async (req,res) => {
    const id = req.params.id;
    const deleted = await LocationModel.destroy({
        where: { id: id}
    });
    res.json(deleted);
});

export {adminLocationsRouter};