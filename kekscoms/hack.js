const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: 'hack',
    type: 'unlisted',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        msg.channel.send('```diff\n- Angriff fehlgeschlagen. -\n+ KeksSicherheit aktiv. Schutz: 99,99% +```')
    }
}
