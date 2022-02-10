import { PrivateMessage } from 'bancho.js'
import omniscient from '../omniscient'
import osuColle from 'osuColle';
import fs from 'fs'

omniscient.on('boot', async () => {

})

omniscient.on('pm', async (instance: PrivateMessage) => {
    let cmd = instance.message.substring(1).split(' ')[0]
    if (cmd === 'favorites' || cmd === 'f')
        instance.user.sendMessage(randomBeatmap())
})

function randomBeatmap () {
    return `https://osu.ppy.sh/beatmapsets/${Math.floor(Math.random() * 4000) + 1}`
}