import { Pokemon, Exchange } from '../model/trainer.js';

const exchangePurpose = async (req, res) => {
  const { id: idPokemonSender } = req.params;
  const { idTrainer: idTrainerReceiver, idPokemon: idPokemonReceiver } = req.body;
  const idTrainerSender = res.locals.requestor.id;
  try {
    const pokemonSender = await Pokemon.findOne({
      where: {
        id: idPokemonSender,
        trainerId: idTrainerSender,
      },
    });

    const pokemonReceiver = await Pokemon.findOne({
      where: {
        id: idPokemonReceiver,
        trainerId: idTrainerReceiver,
      },
    });
    if (!pokemonReceiver || !pokemonSender) {
      return res.status(404)
        .send('Pokemon not found');
    }
    const { id } = await Exchange.create({
      idSender: idTrainerSender,
      idReceiver: idTrainerReceiver,
      idPokemonSender,
      idPokemonReceiver,
      status: 'SENT',
    });
    return res.status(200).send({ id });
  } catch (err) {
    return res.status(500).send(err);
  }
};

const exchangeResponse = async (req, res) => {
  const { id } = req.params;
  const { accept } = req.body;
  try {
    const exchange = await Exchange.findOne({
      where: {
        id,
        idReceiver: res.locals.requestor.id,
      },
    });
    if (!exchange || exchange.status !== 'SENT') return res.status(404).send('Exchange not found');
    const pokemonSender = await Pokemon.findOne({
      where: {
        id: exchange.idPokemonSender,
        trainerId: exchange.idSender,
      },
    });
    const pokemonReceiver = await Pokemon.findOne({
      where: {
        id: exchange.idPokemonReceiver,
        trainerId: exchange.idReceiver,
      },
    });
    if (!pokemonReceiver || !pokemonSender) {
      return res.status(404)
        .send('Pokemon not found');
    }
    if (!accept) {
      exchange.status = 'REFUSED';
      await exchange.save();
      return res.status(201).send('Exchange refused');
    }
    pokemonSender.trainerId = exchange.idReceiver;
    pokemonReceiver.trainerId = exchange.idSender;
    exchange.status = 'ACCEPTED';

    await pokemonSender.save();
    await pokemonReceiver.save();
    await exchange.save();
    return res.status(201).send('Exchange accepted');
  } catch (err) {
    return res.status(500).send(err);
  }
};

export default { exchangePurpose, exchangeResponse };
