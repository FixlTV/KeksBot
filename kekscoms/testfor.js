const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['testfor'],
    expectedArgs: '<Text>',
    minArgs: 1,
    permission: '',
    modonly: 1,
    type: 'unlisted',
    callback: (msg, args, client, serverdata, userdata, config) => {
        if (config.mods.includes(msg.author.id)) {
            msg.channel.send(`\`\`${args.join(' ')}\`\``)
            msg.delete()
        } else {
            msg.react(msg.guild.emojis.cache.get('775004095056052225'))
            msg.delete({ timeout: 3000 })
        }
    }
}