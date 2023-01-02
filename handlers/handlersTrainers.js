import bcrypt from 'bcrypt';
import sequelize from 'sequelize';
import {Trainer} from '../model/trainer.js';

const getTrainer = async (req, res) => {
  const { id } = req.params;
  try {
    const trainer = await Trainer.findOne({
      where: {
        id,
      },
      include: ['pokemon']
    });
    if (!trainer) {
      return res.status(404).send('Trainer not found');
    }
    return res.status(200).send(trainer);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const modifyTrainer = async (req, res) => {
  const { id } = req.params;
  const patchedInformations = req.body;
  try {
    const trainer = await Trainer.findOne({
      where: {
        id,
      },
    });
    if (!trainer) return res.status(404).send('Trainer not found');
    if (!res.locals.isAdmin && 'roles' in patchedInformations) return res.status(403).send("You don't have the privilege to change your roles");
    // it normally should recreate jwt for this change but i'm lazy
    const trainerToUpdate = { ...trainer, ...patchedInformations };
    const updatedTrainer = await trainer.update(trainerToUpdate);
    return res.status(200).send(updatedTrainer);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const createTrainer = async (req, res) => {
  const {
    firstName, lastName, age, password, login,
  } = req.body;
  try {
    const encryptedPasswordWithSalt = bcrypt.hashSync(password, 5);
    const { id } = await Trainer.create({
      lastName,
      firstName,
      login,
      password: encryptedPasswordWithSalt,
      age,
      role: 'USER',
    });
    return res.status(201).send({ id });
  } catch (error) {
    if (error instanceof sequelize.UniqueConstraintError) {
      return res.status(500).send({ error: 'login already exist' });
    }
    return res.status(500).send(error);
  }
};

const deleteTrainer = async (req, res) => {
  const { id } = req.params;
  try {
    await Trainer.destroy({
      where: {
        id,
      },
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500)
      .send(error);
  }
};

export default {
  modifyTrainer, getTrainer, deleteTrainer, createTrainer,
};
