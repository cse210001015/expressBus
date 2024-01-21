import * as express from 'express';
import { UserModel } from '../db/db.providers.js';

const adminUsersRouter = express.Router();

adminUsersRouter.get('/', async(req,res) => {
    const users = await UserModel.findAll({
        where: req.query,
    });
    res.json(users);
});

adminUsersRouter.post('/', async(req, res) => {
    const newUser = await UserModel.create(req.body);
    res.json(newUser);
});

adminUsersRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.findByPk(id);
    res.json(user);
});

adminUsersRouter.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const [updatedRowsCount, updatedRows] = await UserModel.update(req.body, {
        where: { id: id },
        returning: true,
    });
    if(updatedRowsCount>0)      res.json(updatedRows[0]);
    else                        res.status(404).json({error: "Bus Not Found"});
});

adminUsersRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const deleted = await UserModel.destroy({
        where: {id: id},
    });
    return deleted;
});

export {adminUsersRouter};