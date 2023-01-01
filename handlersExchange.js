import { Trainer, Pokemon, Exchange } from './model/trainer';

const exchangePurpose = (req, res, next) => {
  const { idPokemonSender: id } = req.params;
  const { idTrainerReceiver: idTrainer, idPokemonReceiver: idPokemon } = req.body;
  const idTrainerSender = res.locals.requestor.id;

};

export default { exchangePurpose };
