import express, { Router } from 'express';
import config from './config/config.js';
import handlersSecurity from './handlersSecurity.js';
import handlersTrainers from './handlersTrainers.js';

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

app.use((req, res) => {
  res.status(404).send('URL not found');
});

app.listen(config.NODE_APP_PORT, () => {
  console.log(`The server is up on port ${config.NODE_APP_PORT}`);
});
