import config from './config/config'

const app = express()

app.use(express.json())

app.listen(config.NODE_APP_PORT, () => {
    console.log(`The server is up on port ${config.NODE_APP_PORT}`)
})