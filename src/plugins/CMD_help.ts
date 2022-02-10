import { PrivateMessage } from 'bancho.js'
import omniscient from '../omniscient'

omniscient.on('pm', async (instance: PrivateMessage) => {
    let cmd = instance.message.substring(1).split(' ')[0]
    if (cmd === 'help' || cmd === 'h')
        return instance.user.sendMessage('[https://github.com/AuracleTech/omniscient omniscient on GitHub]')
})