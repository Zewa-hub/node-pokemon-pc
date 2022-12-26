import config from "./config/config.js";
import Trainer from "./model/trainer.js";
import express from 'express';
import bcrypt from 'bcrypt';

const app = express()

app.use(express.json())

app.listen(config.NODE_APP_PORT, () => {
    console.log(`The server is up on port ${config.NODE_APP_PORT}`)
})

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

app.post('/register',async (req,res)=>{
    const  { firstName, lastName, age, password, login } = req.body
    try {
        const encryptedPassword = bcrypt.hashSync(password, 5)
        const { id } = await Trainer.create({
            lastName,
            firstName,
            login,
            password : encryptedPassword,
            age,
            role : "USER"
        })
        return res.status(201).send({id})
    }
    catch (error)
    {
        return res.status(500).send(error)
    }
})


app.get('/trainer/:id',async (req,res) => {
    const { id } = req.params
    try {
        const trainer = await Trainer.findOne({
            where: {
                id
            }
        })
        if (!trainer)
        {
            return res.status(404).send('Trainer not found')
        }
        return res.status(200).send(trainer)
    }
    catch (error)
    {
        return res.status(500).send(error)
    }
})

app.patch('/trainer/:id',async (req,res) =>{
  const {id} = req.params
  const patchedInformations = req.body
  try {
      const trainer = await Trainer.findOne({
          where: {
              id
          }
      })
      if (!trainer)
          return res.status(404).send("Trainer not found")
      const trainerToUpdate = {...trainer, ...patchedInformations}
      const updatedTrainer = await trainer.update(trainerToUpdate)
      return res.status(200).send(updatedTrainer)
  }catch (error){
      return res.status(500).send(error)
  }
})

app.delete('/trainer/:id',async(req,res)=>{
    const { id } = req.params
    try {
        await Trainer.destroy({
            where: {
                id
            }
        })
        return res.sendStatus(200)
    }catch (error){
        return res.status(500).send(error)
    }
})

app.use((req, res, next) => {
    res.status(404).send('URL not found')
})