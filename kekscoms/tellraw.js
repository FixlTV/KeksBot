const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['say', 'tellraw'],
    expectedArgs: '<Text>',
    description: 'Sagt etwas.',
    minArgs: 1,
    type: 'unlisted',
    permissions: 'MANAGE_MESSAGES',
    callback: (msg, args, client, serverdata, userdata) => {
        msg.delete()
        msg.channel.send(args.join(' '))
    }
}
