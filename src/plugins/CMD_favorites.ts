import { PrivateMessage } from 'bancho.js'
import osu_collection from 'osu-collection'
import axios from 'axios'
import plugin from '../plugin'
import fs from 'fs'

const modes = [ 'osu', 'taiko', 'fruits', 'mania' ]
let beatmapsHashes = []

export const main: plugin = {
    name: 'Favorites',
    primordial: ['COLLECTION_PATH', 'COLLECTION_NAMES', 'API_KEY'],
    events: {
        'boot': [async () => {
            if (!fs.existsSync(process.env.COLLECTION_PATH))
                throw new Error('Collection path does not exist')

            if (!process.env.COLLECTION_NAMES)
                throw new Error('Collection names is empty')

            let all = await osu_collection(process.env.COLLECTION_PATH)

            let selectedCollections = []
            for (let name of process.env.COLLECTION_NAMES.split(',')) {
                let collection = all.collections.find(collection => collection.name === name)
                if (!collection)
                    throw new Error(`Collection ${name} not found`)
                selectedCollections.push(collection)
            }
            
            let selectedHashes = selectedCollections.map(collection => collection.hashes)
            for (let hashes of selectedHashes)
                for (let hash of hashes)
                    if (!beatmapsHashes.includes(hash))
                        beatmapsHashes.push(hash)
            
            plugin.log(main, `Loaded ${beatmapsHashes.length} beatmaps`)
        }],
        'pm': [async (instance: PrivateMessage) => {
            let cmd = instance.message.substring(1).split(' ')[0]
            if (cmd === 'favorites' || cmd === 'f') {
                let found = false
                while (!found) {
                    const hash = beatmapsHashes[Math.floor(Math.random() * beatmapsHashes.length)]
                    const { data } = await axios.get(`https://osu.ppy.sh/api/get_beatmaps?k=${process.env.API_KEY}&h=${hash}`)

                    if (data.error)
                        beatmapsHashes = beatmapsHashes.filter(beatmap => beatmap !== hash)
                    else {
                        found = true
                        let mode = modes[data[0].mode]
                        return instance.user.sendMessage(`[https://osu.ppy.sh/beatmapsets/${data[0].beatmapset_id}#${mode}/${data[0].beatmap_id} ${data[0].artist} - ${data[0].title} [${data[0].version}]]`)
                    }
                }
            }
        }]
    },
}

export default main