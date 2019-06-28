import express from 'express';
import error from '../middleware/error';
import passport from 'passport';
import { ensureLoggedIn } from 'connect-ensure-login';


export default function(app: express.Application, passport: passport.Authenticator) {

    app.get('/', async(req, res) => {
        res.render('index');
    });

    const oath = express.Router();
    app.use('/oath2/v1', oath);

    const api = express.Router();
    app.use('/api/v1', api);

    api.get('/', async(req, res) => {
        res.send('Hi API');
    });

    api.post('/token', passport.authenticate('oauth2', {
        session: true,
        successReturnToOrRedirect: '/'
    })),

    api.get('sellme', ensureLoggedIn('/auth-api'), (req, res) => {
        res.send('A private message')
    })

    // 404 ERROR HANDLER
    app.use((req, res) => {
        res.status(404);
        if (req.accepts('html')) {
            return res.render('errors/404')
        }
        if (req.accepts('json')) {
            return res.send({ error: 'Page Not found' });
        }
        res.status(404).type('txt').send('Not found');
    });
    app.use(error);
}