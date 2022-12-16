import { Sequelize } from 'sequelize'
import config from '../config/config'
//todo : mettre en variable d'environnement + mettre une db local


const Database = new Sequelize(
    "userAPI",
    config.DATABASE_USERNAME,
    config.DATABASE_PASSWORD,
    {
        host : config.DATABASE_HOST,
        port: config.MYSQL_PORT,
        dialect:"mysql"
    });

(async () => {
    try {
        await Database.authenticate()
        await Database.sync()
        console.log("Database is ready")
    }
    catch (error){
        console.log("database kaka")
    }
})()

export default Database