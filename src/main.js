import express from 'express';
import bodyParser from 'body-parser';
import { adminBusRouter } from './admin/adminBuses.js';
import { adminLocationsRouter } from './admin/adminLocations.js';
import { adminStopsRouter } from './admin/adminStops.js';
import { adminUsersRouter } from './admin/adminUsers.js';
import { adminBookingsRouter } from './admin/adminBookings.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
});

app.use('/admin/buses', adminBusRouter);
app.use('/admin/locations', adminLocationsRouter);
app.use('/admin/users', adminUsersRouter);
app.use('/admin/stops', adminStopsRouter);
app.use('/admin/bookings', adminBookingsRouter);

app.listen(port , () => {
    console.log(`Server is running on port: ${port}`);
});
