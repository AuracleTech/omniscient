import { EventTypes } from './events'

export default class plugin {
    constructor(name: string, primordial: string[], events: { [K in EventTypes]?: Function[] }) {
        this.name = name
        this.primordial = primordial
        this.events = events
    }
    name: string
    primordial: string[]
    events: { [K in EventTypes]?: Function[] }
    static log?(instance: plugin, message: string): void { console.log(`[${instance.name}] ${message}`) }
}