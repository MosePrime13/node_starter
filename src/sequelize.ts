import {Sequelize} from 'sequelize-typescript';
import * as dotenv from 'dotenv';

dotenv.config({path: __dirname + '/../.env'});

const dbConfigs = require('../config/config.json')[process.env.NODE_ENV];
const { database, username, password, params } = dbConfigs;

export const sequelize = new Sequelize(database, username, password, {
    dialect: params.dialect,
    host: params.host,
    logging: params.logging,
    storage: ':memory:',
    modelPaths: [__dirname + '/models']
});