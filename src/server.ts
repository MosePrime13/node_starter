import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from 'winston';

import session from 'express-session';
import passport from 'passport';
import flash = require('connect-flash');

import 'express-async-errors';

dotenv.config({ path: __dirname + '/../.env' });

import startHandleError from './controllers/handle_errors';
import startRoutes from './routes';
import startViews from './controllers/views';
import { sequelize } from './sequelize';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));
app.use(cors());
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

export const consoleLogger = winston.createLogger({ transports: [ new winston.transports.Console({ format: winston.format.simple() }) ] });
export const apiLogger = winston.createLogger({ transports: [ new winston.transports.Console({ format: winston.format.simple() }), new winston.transports.File({filename: 'logs/apiLogs.log'}) ] });
export const uncaughtLogger = winston.createLogger({ transports: [ new winston.transports.Console({ format: winston.format.simple() }), new winston.transports.File({filename: 'logs/uncaughtLogs.log'}) ] });
export const unhandledLogger = winston.createLogger({ transports: [ new winston.transports.Console({ format: winston.format.simple() }), new winston.transports.File({filename: 'logs/unhandledLogs.log'}) ] });

startHandleError();
(async () => {
    await sequelize.sync({ force: true }).then(() => consoleLogger.info('Nice! Database looks fine')).then(() => {
        // initTables();
    });
})();


startRoutes(app, passport);
startViews(app);

const port = process.env.PORT;
app.listen(port, () => consoleLogger.info(`Server listening on port ${port}`) );