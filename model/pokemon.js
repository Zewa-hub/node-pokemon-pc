import { DataTypes, Model} from "sequelize";
import Database  from "./db.js";

class Pokemon extends Model {}

Pokemon.init({
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement : true,
        primaryKey: true
    },
    species : {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    shiny: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize : Database,
    modelName: 'pokemon',
    timestamps: false
})

export default Pokemon