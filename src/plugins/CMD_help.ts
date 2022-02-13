import { PrivateMessage } from 'bancho.js'
import plugin from '../plugin'

export const main: plugin = {
    name: 'Help',
    primordial: [],
    events: {
        'pm': [async (instance: PrivateMessage) => {
            let cmd = instance.message.substring(1).split(' ')[0]
            if (cmd === 'help' || cmd === 'h')
                return instance.user.sendMessage('[https://github.com/AuracleTech/omniscient omniscient on GitHub]')
        }]
    },
}

export default main