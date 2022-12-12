import { Sequelize } from 'sequelize'
//todo : mettre en variable d'environnement + mettre une db local


const Database = new Sequelize(
    "userAPI",
    "doggocoptere",
    "Abdel123",
    {
        host : "db4free.net",
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