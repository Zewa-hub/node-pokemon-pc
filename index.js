import express, { Router } from 'express';
import config from './config/config.js';
import handlersSecurity from './handlers/handlersSecurity.js';
import handlersTrainers from './handlers/handlersTrainers.js';
import handlersPokemon from './handlers/handlersPokemon.js';
import handlersExchange from './handlers/handlersExchange.js';

const OauthRouter = Router();
const app = express();

app.use(express.json());
app.use(OauthRouter);

OauthRouter.post('/oauth/token', [handlersSecurity.getToken]);

OauthRouter.get('/authorize', [handlersSecurity.authorize]);

app.get('/trainer/:id', [handlersSecurity.checkAuthorization, handlersTrainers.getTrainer]);

app.post('/register', [handlersTrainers.createTrainer]);

app.patch('/trainer/:id', [handlersSecurity.checkAuthorization, handlersSecurity.isUserAuthorized, handlersTrainers.modifyTrainer]);

app.delete('/trainer/:id', [handlersSecurity.checkAuthorization, handlersSecurity.isUserAuthorized, handlersTrainers.deleteTrainer]);

app.get('/pokemon', [handlersSecurity.checkAuthorization, handlersPokemon.getPokemon]);

app.patch('/pokemon/:id', [handlersSecurity.checkAuthorization, handlersSecurity.isUserAuthorizedPokemon, handlersPokemon.modifyPokemon]);

app.delete('/pokemon/:id', [handlersSecurity.checkAuthorization, handlersSecurity.isUserAuthorizedPokemon, handlersPokemon.deletePokemon]);

app.post('/exchange/:id', [handlersSecurity.checkAuthorization, handlersExchange.exchangePurpose]);

app.patch('/exchange/:id', [handlersSecurity.checkAuthorization, handlersExchange.exchangeResponse]);
app.use((req, res) => {
  res.status(404).send('URL not found');
});

app.listen(config.NODE_APP_PORT, () => {
  console.log(`The server is up on port ${config.NODE_APP_PORT}`);
});
