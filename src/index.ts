// Modules
import dotenv from 'dotenv'
import * as banchojs from 'bancho.js'
import omniscient from './omniscient'
import fs from 'fs'

// Plugins
const plugins = fs.readdirSync('./out/plugins').filter(file => file.endsWith('.js'))
for (const plugin of plugins) import(`./plugins/${plugin}`)

// Environments
dotenv.config()
if (!process.env.IRC_USERNAME || !process.env.IRC_PASSWORD || !process.env.API_KEY) {
    console.error('Missing environment variables')
    process.exit(1)
}
const osuIRC = new banchojs.BanchoClient({ username: process.env.IRC_USERNAME, password: process.env.IRC_PASSWORD, apiKey: process.env.API_KEY, host: 'irc.ppy.sh', port: 6667 })

// Events
omniscient.emit('boot', omniscient)
osuIRC.connect().then(() => {
    omniscient.emit('connect', osuIRC)
    osuIRC.on('PM', async instance => {
        if (instance.self) omniscient.emit('reply', instance)
        else omniscient.emit('pm', instance)
    })
})

// Handling
process.on('uncaughtException', err => console.error(err))