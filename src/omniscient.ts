export type EventTypes = 'boot' | 'pm'

export default class Events {
    private static events: { [key: string]: Function[] } = {}

    static on(event: EventTypes, callback: Function): void {
        if (!this.events[event])
            this.events[event] = []
        this.events[event].push(callback)
    }

    static emit(event: EventTypes, data?: any): void {
        if (this.events[event])
            this.events[event].forEach(callback => callback(data))
    }
}