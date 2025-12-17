import express from 'express'
import cors from 'cors'
import { user, event, rsvp, dashboard } from './api/index.js'
import cookieParser from "cookie-parser";


export const expressApp = async (app) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors({
        origin: true,
        credentials: true
    }));

    app.use(cookieParser());


    //api
    user(app);
    event(app);
    rsvp(app);
    dashboard(app);

}