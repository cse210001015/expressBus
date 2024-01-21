import { BusModel, StopModel, BookingsModel, BookedStopsModel } from "../db/db.providers.js";
import { timeStringToSeconds } from "../../utils/timeToSeconds.js";
import { dijkstra } from "../../utils/dijkstra.js";

async function getBuses(startLoc, endLoc, date, startTime) {
    /* Array of All the Stops(Used to run Dijkstra).
    Id, Location, busId, arrivalTime, departureTime, extraCost, isAvailable.*/
    date = new Date(date);
    const dayIndex = date.getDay();

    // fetching the buses and the stops 
    const allBuses = await BusModel.findAll();
    const stops = await StopModel.findAll(); 
    
    // fetching booked stops
    const bookedData = await BookedStopsModel.findAll({
        where: { date: date },
        attributes: ['stopId'],
    });    
    bookedData = bookedData.map((data)=> data.stopId);    

    //Bucket the data by busId and availability.
    //Also take the buses as input (join). Useful for startTime.
    //Sort the buckets by arrivalTime.
    //Find arrivalTime+startTime(convert time to integer): integer.
    //Use this info to construct a graph between the locations (Adjacency List).
    const stopList = {};
    const startTimes = {};
    const locations = {};
    const bookedStopIds = {};

    // buses( bus.id => (stops it will have, time at which it starts))
    for(const bus of allBuses) {
        if(bus.operationDays & (1 << dayIndex))  {
            stopList[bus.id] = [];
            startTimes[bus.id] = timeStringToSeconds(bus.startTime);
        }    
    }

    // hash the stops that are booked
    for(const stop of bookedData) {
        bookedStopIds[stop] = 1;
    }

    // iterate through all stops if the stop is not in hashmap then add it to the respective bus's stoplist
    for(const stop of stops) {
        if(!bookedStopIds[stop.id]) {
            if(stopList[stop.busId])       stopList[stop.busId].push(stop);
        }
    }

 
    for(const bus in stopList) {
        // sort the stops for each bus w.r.t arrivalTimes
        stopList[bus].sort((a, b) => {
            const timeA = new Date(a.arrivalTime);
            const timeB = new Date(b.arrivalTime);
            return timeA - timeB;
        });
        const extra = startTimes[bus];
        
        // locations (locationId => (list of neighboring locations))
        for(let i=0;i<stopList[bus].length-1;i++) {
            const loc = stopList[bus][i].location;
            if(!locations[loc]) {
                locations[loc] = [];
            }
            locations[loc].push([
                stopList[bus][i+1].departureTime + extra,
                stopList[bus][i+1].location, 
                stopList[bus][i+1].arrivalTime + extra
            ]);
        }
    }

    //Find all the locations then add edges between them and also set the edge weights dynamically( you know the arrival time at next location ).
    //Now construct a priority queue and run the dijkstra algorithm.
    return dijkstra(locations, startLoc, endLoc, timeStringToSeconds(startTime), 20);
};

async function busAvailable(date, startTime, endTime, busId) {
    date = new Date(date);
    const pr1 = BookingsModel.findAll({
        where: { busId: busId, date: date },
        include: [{
            model: StopModel,
            as: 'end',
            attributes: ['arrivalTime']
        },
        {
            model: StopModel,
            as: 'start',
            attributes: ['departureTime']
        }],
    });

    const pr2 = BusModel.findByPk(busId,{
        attributes: ['left', 'right', 'columns']
    });

    const [bookings, {left, right, columns} ] = await Promise.all([pr1, pr2]);

    const seatsMap = [];
    for(let i=0;i<columns;i++){
        seatsMap[i] = [];
        for(let j=0;j<left+right;j++){
            seatsMap[i][j] = 0;
        }
    }

    for(const booking of bookings) {
        if(booking.end.arrivalTime<=startTime) {
            continue;
        }
        if(booking.start.departureTime>=endTime) {
            continue;
        }
        seatsMap[booking.row-1][booking.column-1] = 1; 
    }

    const ans = [];

    for(let i=0;i<columns;i++){
        for(let j=0;j<left+right;j++){
            if(seatsMap[i][j] === 0) {
                ans.push([i+1,j+1]);
            }
        }
    }
    return ans;
};

export {getBuses, busAvailable};


// StopModel.init({
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: UUIDV4,
//         primaryKey: true,
//         allowNull: false,
//     },
//     location: {
//         type: DataTypes.UUID,
//         references: {
//             model: LocationModel,
//             key: 'id'
//         },
//         allowNull: false,
//     },
//     busId: {
//         type: DataTypes.UUID,
//         references: {
//             model: BusModel,
//             key: 'id',
//         },
//         allowNull: false,
//     },
//     arrivalTime: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     departureTime: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     extraCost: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//     }
// }