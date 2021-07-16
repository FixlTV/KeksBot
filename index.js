const discord = require('discord.js')
const client  = new discord.Client
const config  = require('./config.json')
const automod = require('./automod/automod')
const commandhandler = require('./commandhandler')
const eventhandler = require('./eventhandler')

var date = new Date()
console.log(`Starte System am ${date.getDate()}.${date.getMonth() +1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

client.once('ready', async () => { //Status
    await client.user.setStatus('idle')
    var start = Date.now()
    console.log(`[${client.user.username}]: Client geladen.`)
    console.log(`[${client.user.username}]: System wird gestartet...`)
    client.setMaxListeners(0)
    await commandhandler(client)
    await eventhandler(client)
    await automod(client)
    var end = Date.now()
    console.log(`[${client.user.username}]: System aktiv.`)
    console.log(`[${client.user.username}]: Startzeit betrug ${end - start} ms.`)
    await client.user.setStatus('online')
})

client.login(config.token)