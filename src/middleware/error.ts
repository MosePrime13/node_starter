import { apiLogger } from '../server';
import * as express from 'express';

export default function(err, req: express.Request, res: express.Response, next){
    apiLogger.error(err.message);
    res.status(500);
    if (req.accepts('html')) {
        return res.render('errors/500');
    }
    if (req.accepts('json')) {
        return res.send({ error: 'Server error man' });
    }

}