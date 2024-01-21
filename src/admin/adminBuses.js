import * as express from "express";
import { BusModel } from "../db/db.providers.js";

const adminBusRouter = express.Router();

adminBusRouter.post('/', async (req,res) => {
    const newBus = await BusModel.create(req.body);
    res.json(newBus);
});

adminBusRouter.get('/', async(req,res) => {
    const allBuses = await BusModel.findAll();
    res.json(allBuses);
});

adminBusRouter.get('/:id', async(req,res) => {
    const id = req.params.id;
    const bus = await BusModel.findByPk(id);
    res.json(bus);
});

adminBusRouter.patch('/:id', async(req,res) => {
    const id = req.params.id;
    const [updatedRowsCount, updatedRows] = await BusModel.update(req.body, { where: {id: id}, returning: true});
    if(updatedRowsCount>0)      res.json(updatedRows[0]);
    else                        res.status(404).json({error: "Bus Not Found"});
});

adminBusRouter.delete('/:id', async(req,res) => {
    const id = req.params.id;
    const deletedBus = await BusModel.destroy({ where: {id: id}});
    res.json(deletedBus);
});

export {adminBusRouter};