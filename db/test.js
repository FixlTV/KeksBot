// require('./getData')('userdata','514089658833960963').then(x => console.log(x))
const discord = require('discord.js')
const client = new discord.Client({ intents: ['GUILDS'] })

client.once('ready', async () => {
    let channel = await client.channels.fetch('775001585541185550')
    channel.send('Mir geht es gut, danke der Nachfrage ^^')
})

client.login(require('../config.json').token)