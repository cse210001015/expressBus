import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

import * as dotenv from 'dotenv'

dotenv.config();
const dbHost = process.env.DBHOST;
const dbPort = process.env.DBPORT;
const dbName = process.env.DBNAME;
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;

const sequelize = new Sequelize(dbName, dbUser, dbPassword,{
    host: dbHost,
    dialect: "postgres",
    port: dbPort,
    logging: (...msg) => console.log(msg),
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000,
    },
});

class UserModel extends(Model) {};

UserModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
{
    sequelize,
    modelName: "Users",
    tableName: 'user'
});

class LocationModel extends Model {}

LocationModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    coordinatesX: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    coordinatesY : {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    sequelize,
    modelName: "Locations",
    tableName: 'locations'
});

class BusModel extends Model {}

BusModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    left: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    right: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    columns: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    operationDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    }
},
{
    sequelize,
    modelName: "Buses",
    tableName: 'bus'
});

class StopModel extends Model {}

StopModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    location: {
        type: DataTypes.UUID,
        references: {
            model: LocationModel,
            key: 'id'
        },
        allowNull: false,
    },
    busId: {
        type: DataTypes.UUID,
        references: {
            model: BusModel,
            key: 'id',
        },
        allowNull: false,
    },
    arrivalTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    departureTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    extraCost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
},
{
    sequelize,
    modelName: "Stops",
    tableName: 'stops'
});

class BookingsModel extends Model {}

BookingsModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: UserModel,
            key: 'id',
        },
        allowNull: false,
    },
    busId: {
        type: DataTypes.UUID,
        references: {
            model: BusModel,
            key: 'id',
        },
        allowNull: false,
    },
    row: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    column: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fromStop: {
        type: DataTypes.UUID,
        references: {
            model: StopModel,
            key: 'id',
        },
    },
    toStop: {
        type: DataTypes.UUID,
        references: {
            model: StopModel,
            key: 'id',
        },
    },
},
{
    sequelize,
    modelName: "Bookings",
    tableName: 'bookings'
});

BookingsModel.belongsTo(StopModel, {
    foreignKey: 'fromStop',
    as: 'start'
});

BookingsModel.belongsTo(StopModel, {
    foreignKey: 'toStop',
    as: 'end'
});


// await sequelize.sync({force: true});
export  {sequelize, UserModel, BookingsModel, BusModel, StopModel, LocationModel};
