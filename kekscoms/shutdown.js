const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['shutdown', 'stop', 'destroy'],
    modonly: 1,
    description: 'Schaltet den Bot aus. Nur im Notfall einsetzen!',
    type: 'unlisted',
    callback: (msg, args, client, serverdata, userdata, config) => {
        if(config.mods.includes(msg.author.id)) {
            msg.delete()
            client.destroy()
        } else {
            msg.delete()
        }
    }
}
