// eslint-disable-next-line max-classes-per-file
import { DataTypes, Model } from 'sequelize';
import Database from './db.js';

export class Trainer extends Model {}

Trainer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING(50),
      defaultValue: 'USER',
    },
  },
  {
    sequelize: Database,
    modelName: 'trainer',
    timestamps: false,
  },
);

export class Pokemon extends Model {}

Pokemon.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  species: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weight: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  shiny: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: Database,
  modelName: 'pokemon',
  timestamps: false,
});

export class Exchange extends Model {}

Exchange.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    idSender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Trainer,
        key: 'id',
      },
    },
    idReceiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Trainer,
        key: 'id',
      },
    },
    idPokemonSender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pokemon,
        key: 'id',
      },
    },
    idPokemonReceiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pokemon,
        key: 'id',
      },
    },
  },
  {
    sequelize: Database,
    modelName: 'trainer',
    timestamps: false,
  },
);

Trainer.hasMany(Pokemon, { as: 'pokemon', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Pokemon.belongsTo(Trainer, {
  as: 'trainer',
});
