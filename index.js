import config from "./config/config.js";
import Trainer from "./model/trainer.js";
import express from 'express';

const app = express()

app.use(express.json())

app.listen(config.NODE_APP_PORT, () => {
    console.log(`The server is up on port ${config.NODE_APP_PORT}`)
})

app.post('/register',async (req,res)=>{
    const  { firstName, lastName, age, password, login } = req.body
    var role = "READER"
    try {
        const { id } = await Trainer.create({
            lastName,
            firstName,
            login,
            password,
            age
        })
        return res.status(201).send({id})
    }
    catch (error)
    {
        return res.status(500).send(error)
    }
})

app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
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
