export default class Events {
    private static events: { [key: string]: Function[] } = {}

    static on(event: string, callback: Function): void {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(callback)
    }

    static emit(event: string, data: any): void {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data))
        }
    }
}