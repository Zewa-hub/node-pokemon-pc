import Trainer from "./model/trainer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const acceptedScopes = ["USER","ADMIN"]
const authorizationCode = 'OAUTH_TEST_APP_ACCEPTED'
const acceptedClientId = 'OAUTH_TEST_APP'
const acceptedClientSecret = 'OAUTH_TEST_APP_SECRET'

const getToken = async (req,res) => {
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
}

const authorize = async(req,res) => {
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
}

const checkAuthorization = async (req,res,next) => {
    const authorization = req.headers['authorization']
    if (!authorization){
        return res.status(401).send({error: 'You are not connected'})
    }
    const bearerToken = authorization.split(' ')
    if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer')
    {
        return res.status(401).send({error: 'Invalide token type'})
    }
    try {
        res.locals.requestor = await  jwt.verify(bearerToken[1], 'ServerInternalPrivateKey')
    } catch (err){
        if (err instanceof jwt.TokenExpiredError){
            return res.redirect('/')
        }
        return res.status(500).send(err)
    }
    next()
}

const isUserAdmin = async (req,res,next) => {
    const user = await Trainer.findById(res.locals.requestor.id)
    if (!user)
    {
        return res.status(404).send("Trainer not found")
    }
    if (!Trainer.hasScope(trainer,'ADMIN')){
        return res.status(403).send({error: "You don't have the privilege to do this action"})
    }
    next()
}

export default {isUserAdmin, checkAuthorization, getToken, authorize};