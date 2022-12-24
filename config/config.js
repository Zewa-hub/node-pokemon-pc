import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.resolve('.','config',`.env.${process.env.NODE_ENV}`)
})
const config ={
    NODE_ENV: process.env.NODE_ENV,
    NODE_APP_PORT: process.env.NODE_APP_PORT,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE : process.env.DATABASE,
    MYSQL_PORT: process.env.MYSQL_PORT
}

export default config