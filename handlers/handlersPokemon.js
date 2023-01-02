import {Pokemon } from '../model/trainer.js';

const getPokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findAll({
      where: {
        trainerId: res.locals.requestor.id,
      },
    });
    if (!pokemon) {
      return res.status(404).send('Pokemon not found');
    }
    return res.status(200).send(pokemon);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const modifyPokemon = async (req, res) => {
  const { id } = req.params;
  const patchedInformations = req.body;
  try {
    const pokemon = await Pokemon.findOne({
      where: {
        id,
      },
    });
    if (!res.locals.isAdmin && 'trainerId' in patchedInformations) return res.status(403).send("You don't have the privilege to change your roles");
    // it normally should recreate jwt for this change but i'm lazy
    const trainerToUpdate = { ...pokemon, ...patchedInformations };
    const updatedTrainer = await pokemon.update(trainerToUpdate);
    return res.status(200).send(updatedTrainer);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deletePokemon = async (req, res) => {
  const { id } = req.params;
  try {
    await Pokemon.destroy({
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

export default { getPokemon, modifyPokemon, deletePokemon };
