// Modules
import pluginManager from './pluginManager'
import * as banchojs from 'bancho.js'
import events from './events'
import dotenv from 'dotenv'

(async () => {
    dotenv.config()

    for (const variable of ['IRC_USERNAME', 'IRC_PASSWORD', 'API_KEY'])
        if (!process.env[variable])
            throw new Error(`Missing primordial environment variable: ${variable}`)

    await pluginManager.loadAll()
    
    const osuIRC = new banchojs.BanchoClient({ username: process.env.IRC_USERNAME, password: process.env.IRC_PASSWORD, apiKey: process.env.API_KEY, host: 'irc.ppy.sh', port: 6667 })

    // Events
    events.emit('boot')
    osuIRC.connect().then(() => {
        osuIRC.on('PM', async instance => {
            if (!instance.self) return events.emit('pm', instance)
        })
    })

    // Handling
    process.on('uncaughtException', err => {
        console.error(err)
        process.exit(1)
    })
})()