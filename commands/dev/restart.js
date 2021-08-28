const fs = require('fs')
const embeds = require('../../embeds')
const discord = require('discord.js')
const delay = require('delay')

module.exports = {
    commands: ['restart', 'reboot'],
    devonly: 1,
    description: 'Startet den Bot neu. Benötigt why ever eine TAN.',
    type: 'modonly',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        if(config.mods.includes(msg.author.id)) {
            msg.delete()
            require('./sub.restartan')(msg, color, config, 'Neustart', '')
        } else {
            msg.delete()
        }
    }
}