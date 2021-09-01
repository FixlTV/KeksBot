const db = require('./database')
const path = require('path')
const fs = require('fs')
const { Collection } = require('discord.js')
const { Model } = require('mongoose')
const cache = new Collection()
const schemas = new Collection()
/**@type {Collection} */
global.cache = cache

const readCommands = dir => {
    const files = fs.readdirSync(dir)
    for(const file of files) {
        const stat = fs.lstatSync(path.join(dir, file))
        if(stat.isDirectory()) {
            readCommands(path.join(dir, file))
        } else {
            if(file.endsWith('.js')) {
                /** @type {Model} */
                let model = require(path.join(dir, file))
                schemas.set(model.modelName, model)
                cache.set(model.modelName, new Collection())
            }
        }
    }
}
readCommands(path.join(__dirname, '../schemas'))

module.exports = async function(name, id) {
    /** @type {Model} */
    let model = schemas.get(name)
    if(!model) return new Error('404: Model not found')
    if(global.cache.get(name).has(id)) return global.cache.get(name).get(id)
    let database = await db()
    try {
        console.log(1)
        let data = await model.findById(id)
        global.cache.get(name).set(id, data)
        return data
    } catch (error) {
        return error
    } finally {
        database.connection.close()
    }
}