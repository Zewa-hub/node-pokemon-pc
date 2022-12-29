import { DataTypes, Model} from "sequelize";
import Database  from "./db.js";

class Trainer extends Model {}

Trainer.init({
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement : true,
        primaryKey: true
    },
    lastName : {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    login: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    roles: {
        type: DataTypes.STRING(50),
        defaultValue: "USER"
    }
},
    {
        sequelize : Database,
        modelName: 'trainer',
        timestamps: false
    })
export default Trainer