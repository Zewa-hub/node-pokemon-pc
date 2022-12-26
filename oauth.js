import { Router } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import Trainer from "./model/trainer.js";

const OauthRouter = Router()

const acceptedScopes = ["USER","ADMIN"]
const authorizationCode = 'OAUTH_TEST_APP_ACCEPTED'
const acceptedClientId = 'OAUTH_TEST_APP'
const acceptedClientSecret = 'OAUTH_TEST_APP_SECRET'

OauthRouter.post("/oauth/token",async(req,res) => {
    const queryParams= req.query
    const {login, password, scopes} = req.body

    if (queryParams.client_id !== acceptedClientId
        || queryParams.client_secret !== acceptedClientSecret)
    {
        return res.status(401).send({
            error: 'Application is not authorized'
        })
    }
    if (!queryParams.code){
        return res.status(400).send({
            error: 'No authorization code provided'
        })
    }
    const trainer = await Trainer.findOne({
        where: {
            login
        }
    })
    if (!trainer){
        return res.status(404).send({
            error: 'Trainer not found'
        })
    }
    if (!bcrypt.compareSync(password,trainer.password)){
        return res.status(401).send({
            error: "Login or password is wrong"
        })
    }
    const accessToken = jwt.sign(
        {id: trainer.id, scopes},
        'ServerInternalPrivateKey',
        {expiresIn: '10m'}
    )
    return res.status(200).send({
        accessToken,
        tokenType: 'Bearer',
        expiresIn:'10m'
    })
})
OauthRouter.get("/authorize",(req,res) =>{
    const queryParams = req.query

    if (queryParams.client_id !== acceptedClientId){
        return res.status(401).send({
            error: "Application is not authorized"
        })
    }

    if (!queryParams.redirect_uri)
    {
        return res.status(400).send({
            error: "No redirect URI provided"
        })
    }
    if (!acceptedScopes.includes(queryParams.scopes)){
        return res.status(400).send('No user scopes provided')
    }
    return res.redirect(`${queryParams.redirect_uri}?authorization_code:${authorizationCode}`)
})