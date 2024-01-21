import { BusModel, StopModel, BookingsModel } from "../db/db.providers.js";

async function getBuses(startLoc, endLoc, startTime, orderBy) {
    /* Array of All the Stops(Used to run Dijkstra).
    Id, Location, busId, arrivalTime, departureTime, extraCost, isAvailable.*/
    const data = await StopModel.findAll();           
    //Bucket the data by busId and availability.
    //Also take the buses as input (join). Useful for startTime.
    //Sort the buckets by arrivalTime.
    //Find arrivalTime+startTime(convert time to integer): integer.
    //Use this info to construct a graph between the locations (Adjacency List).
    //Find all the locations then add edges between them and also set the edge weights dynamically( you know the arrival time at next location ).
    //Now construct a priority queue and run the dijkstra algorithm.
    return data;
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

    // console.log(seatsMap);

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