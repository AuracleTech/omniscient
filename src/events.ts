export type EventTypes = 'boot' | 'pm' | 'pluginLoad'

export default class Events {
    private static events: { [key: string]: Function[] } = {}

    static on(type: EventTypes, callback: Function): void {
        if (!this.events[type])
            this.events[type] = []
        this.events[type].push(callback)
    }

    static emit(type: EventTypes, data?: any): void {
        if (this.events[type])
            this.events[type].forEach(callback => callback(data))
    }
}