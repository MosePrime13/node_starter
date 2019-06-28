import ejsLayouts from 'express-ejs-layouts';
import express from 'express';
import path from 'path';

export default function(app: express.Application){
    app.set('views', path.join(__dirname, '/../../views'));
    app.set('view engine', 'ejs');
    app.use(ejsLayouts);
}