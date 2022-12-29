import config from "./config/config.js";
import Trainer from "./model/trainer.js";

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import { Router } from "express";
import handlersSecurity from "./handlersSecurity.js";
import handlersRoute from "./handlersRoute.js";

const OauthRouter = Router()
const app = express()


app.use(express.json())
app.use(OauthRouter)

OauthRouter.post("/oauth/token",[handlersSecurity.getToken])

OauthRouter.get("/authorize",[handlersSecurity.authorize])

app.get('/trainer/:id', [handlersRoute.getTrainer])

app.post('/register', [handlersRoute.createTrainer])

app.patch('/trainer/:id', [handlersRoute.modifyTrainer])

app.delete('/trainer/:id', [handlersRoute.deleteTrainer])


app.use((req, res, next) => {
    res.status(404).send('URL not found')
})

app.listen(config.NODE_APP_PORT, () => {
    console.log(`The server is up on port ${config.NODE_APP_PORT}`)
})

