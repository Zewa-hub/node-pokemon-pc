import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Trainer, Pokemon } from '../model/trainer.js';

const acceptedScopes = ['USER', 'ADMIN'];
const authorizationCode = 'OAUTH_TEST_APP_ACCEPTED';
const acceptedClientId = 'OAUTH_TEST_APP';
const acceptedClientSecret = 'OAUTH_TEST_APP_SECRET';
//TODO: Go see for refresh token and cleanup the code + adding more scopes 
const getToken = async (req, res) => {
  const queryParams = req.query;

  const { login, password } = req.body;

  if (queryParams.client_id !== acceptedClientId
        || queryParams.client_secret !== acceptedClientSecret) {
    return res.status(401).send({
      error: 'Application is not authorized',
    });
  }
  if (!queryParams.authorization_code) {
    return res.status(400).send({
      error: 'No authorization code provided',
    });
  }
  const trainer = await Trainer.findOne({
    where: {
      login,
    },
  });
  if (!trainer) {
    return res.status(404).send({
      error: 'Trainer not found',
    });
  }
  if (!bcrypt.compareSync(password, trainer.password)) {
    return res.status(401).send({
      error: 'Login or password is wrong',
    });
  }
  const accessToken = jwt.sign(
    { id: trainer.id, scopes: trainer.roles },
    'ServerInternalPrivateKey',
    { expiresIn: '10m' },
  );
  return res.status(200).send({
    accessToken,
    tokenType: 'Bearer',
    expiresIn: '10m',
  });
};

const authorize = async (req, res) => {
  const queryParams = req.query;

  if (queryParams.client_id !== acceptedClientId) {
    return res.status(401).send({
      error: 'Application is not authorized',
    });
  }

  if (!queryParams.redirect_uri) {
    return res.status(400).send({
      error: 'No redirect URI provided',
    });
  }
  if (!acceptedScopes.includes(queryParams.scope)) {
    return res.status(400).send('No user scopes provided');
  }
  return res.redirect(`${queryParams.redirect_uri}?authorization_code:${authorizationCode}`);
};

const checkAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: 'You are not connected' });
  }
  const bearerToken = authorization.split(' ');
  if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer') {
    return res.status(401).send({ error: 'Invalid token type' });
  }
  try {
    res.locals.requestor = await jwt.verify(bearerToken[1], 'ServerInternalPrivateKey');
    res.locals.isAdmin = res.locals.requestor.roles === 'ADMIN';
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.redirect('/');
    }
    return res.status(500).send(err);
  }
  next();
};

const isUserAuthorized = async (req, res, next) => {
  const { id } = req.params;
  const trainer = await Trainer.findOne({
    where: {
      id: res.locals.requestor.id,
    },
  });
  if (!trainer) {
    return res.status(404).send('Trainer not found');
  }
  if (trainer.id !== parseInt(id, 10) && !res.locals.isAdmin) {
    return res.status(403).send({ error: "You don't have the privilege to do this action" });
  }
  next();
};

const isUserAuthorizedPokemon = async (req, res, next) => {
  const { id } = req.params;
  const pokemon = await Pokemon.findOne({
    where: {
      id,
    },
  });
  if (!pokemon) {
    return res.status(404).send('pokemon not found');
  }
  if (pokemon.trainerId !== parseInt(res.locals.requestor.id, 10) && !res.locals.isAdmin) {
    return res.status(403).send({ error: "You don't have the privilege to do this action" });
  }
  next();
};
export default {
  checkAuthorization, getToken, authorize, isUserAuthorized, isUserAuthorizedPokemon,
};
