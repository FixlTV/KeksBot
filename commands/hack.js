const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')
const delay = require('delay')

module.exports = {
    commands: 'hack',
    type: 'unlisted',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        var message = await msg.channel.send('```diff\n- Zugriff verweigert. -\n+ KeksSicherheit aktiv. Zielobjekt wird eliminiert. +```')
        await delay(10000)
        if(!message.deleted) message.delete().catch()
        return
    }
}
