import passport from 'passport';
import * as bcrypt from 'bcryptjs';
// STRATEGIES
import LocalStrategy from 'passport-local';
import OAuth2Strategy from 'passport-oauth2';

// MODELS
import { User } from '../models/User';

export default function(passport: passport.Authenticator) {

    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function(user, done){ 
        done(null, user);
    });

    // LOCAL SIGN UP
    passport.use('local-signup', new LocalStrategy.Strategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done){
        process.nextTick(() => {
           User.findOne({ where: { email: email } })
            .then( async(user) => {
                if(user) return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

                const userData = {
                    email: email,
                    password: password,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                };

                const newUser = await User.create(userData);
                return done(null, newUser);
            })
        });
    }));

     // LOCAL LOG IN
     passport.use('local-login', new LocalStrategy.Strategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
       User.findOne({ where: { email: email } })
        .then((user) => {
            if(!user) return done(null, false, req.flash('loginMessage', 'Invalid username or password'));

            if(!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('loginMessage', 'Invalid username or password'));

            return done(null, user.get());
        });
    }));


    // OATH 2
    passport.use(new OAuth2Strategy({
        authorizationURL: 'https://www.example.com/oauth2/authorize',
        tokenURL: 'https://www.example.com/oauth2/authorize',
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: ''
    },
    function(accessToken, refreshToken, profile, cb) {

    }));
    
}