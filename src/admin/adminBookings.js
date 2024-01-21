import * as express from 'express';
import { BookingsModel } from '../db/db.providers.js';

const adminBookingsRouter = express.Router();

adminBookingsRouter.get('/', async (req, res) => {
    const bookings = await BookingsModel.findAll({
        where: req.query,
    });
    res.json(bookings);
});

adminBookingsRouter.post('/', async (req, res) => {
    const newBooking = await BookingsModel.create(req.body);
    res.json(newBooking);
});

adminBookingsRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const booking = await BookingsModel.findByPk(id);
    res.json(booking);
});

// adminBookingsRouter.patch('/:id', async (req, res) => {
//     const id = req.params.id;
//     const [updatedRowsCount, updatedRows] = await BookingsModel.update(req.body, {
//         where: { id : id},
//         returning: true,
//     });
//     if(updatedRowsCount>0)      res.json(updatedRows[0]);
//     else                        res.status(404).json({error: "Bus Not Found"});
// });

adminBookingsRouter.delete('/:id', async (req, res)=> {
    const id = req.params.id;
    const deleted = await BookingsModel.destroy({
        where: {id: id},
    });
    res.json(deleted);
});

export {adminBookingsRouter};