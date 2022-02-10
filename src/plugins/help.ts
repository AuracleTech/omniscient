import omniscient from '../omniscient'

omniscient.on('pm', (instance: any) => {
    if (instance.message.substring(1).split(' ')[0] === '!help')
        return instance.user.sendMessage('[https://github.com/AuracleTech/omniscient see the GitHub page]')
})