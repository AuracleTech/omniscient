import * as events from './events'
import plugin from './plugin'
import fs from 'fs'

export default class PluginManager {
    private static pluginsLoaded: plugin[] = []

    static async load(pluginFile: string): Promise<void> {        
        let pluginModule = await import(`${__dirname}/plugins/${pluginFile}`)
        let pluginDefault: plugin = pluginModule.default

        if (!pluginDefault)
            throw new Error(`Plugin ${pluginFile} has no default export`)

        if (this.hasPlugin(pluginDefault.name))
            throw new Error(`Plugin ${pluginDefault.name} already loaded`)

        for (const variable of pluginDefault.primordial)
            if (!process.env[variable])
                throw new Error(`Missing primordial variable '${variable}' for plugin '${pluginDefault.name}'`)

        this.pluginsLoaded.push(pluginDefault)
        this.registerEvents(pluginDefault.name)
        events.default.emit('pluginLoad', pluginDefault)
        return console.log(`Plugin ${pluginDefault.name} loaded`)
    }

    static registerEvents(pluginName: string): void {
        let instance: plugin = this.getPlugin(pluginName)
        if (instance)
            Object.keys(instance.events).forEach((type: events.EventTypes) => {
                instance.events[type].forEach(callback => events.default.on(type, callback))
            })
    }

    static async unload(pluginName: string): Promise<void> {
        let pluginToUnload: plugin = this.getPlugin(pluginName)

        if (!pluginToUnload)
            throw new Error(`Plugin '${pluginName}' not found`)

        let index = this.pluginsLoaded.indexOf(pluginToUnload)
        this.pluginsLoaded.splice(index, 1)
        return console.log(`Plugin ${pluginName} unloaded`)
    }

    static async loadAll(): Promise<void> {
        let pluginsFiles: string[] = fs.readdirSync(`${__dirname}/plugins`).filter(file => file.endsWith('.js'))
        for (const pluginFile of pluginsFiles)
            await this.load(pluginFile)
    }

    static getPlugins(): plugin[] {
        return this.pluginsLoaded
    }

    static getPlugin(name: string): plugin {
        return this.pluginsLoaded.find(plugin => plugin.name === name)
    }

    static getPluginByEvent(event: string): plugin[] {
        return this.pluginsLoaded.filter(plugin => plugin.events[event])
    }

    static hasPlugin(name: string): boolean {
        return this.pluginsLoaded.find(plugin => plugin.name === name) !== undefined
    }
}