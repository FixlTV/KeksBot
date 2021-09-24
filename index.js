const discord = require('discord.js')
const client  = new discord.Client({ intents: ['GUILDS', 'GUILD_BANS', 'GUILD_MEMBERS', 'GUILD_INVITES', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS']})
const config  = require('./config.json')
const automod = require('./automod/automod')
const commandhandler = require('./commandhandler')
const eventhandler = require('./eventhandler')
discord.Collection.prototype.array = function() {return [...this.values()]}

var date = new Date()
console.log(`Starte System am ${date.getDate()}.${date.getMonth() +1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

client.once('ready', async () => { //Status
    await client.user.setStatus('idle')
    client.restarting = 0
    var start = Date.now()
    console.log(`[${client.user.username}]: Client geladen.`)
    console.log(`[${client.user.username}]: System wird gestartet...`)
    client.setMaxListeners(0)
    let mongoose = await require('./db/database')()
    console.log(`[${client.user.username}]: Verbindung zur Datenbank hergestellt`)
    mongoose.connection.close()
    await commandhandler(client)
    await eventhandler(client)
    await automod(client)
    var end = Date.now()
    console.log(`[${client.user.username}]: System aktiv.`)
    console.log(`[${client.user.username}]: Startzeit betrug ${end - start} ms.`)
    await client.user.setStatus('online')
})

client.login(config.token)