const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['prefix', 'setprefix'],
    expectedArgs: '<Prefix>',
    minArgs: 1,
    maxArgs: 1,
    permissions: 'ADMINISTRATOR',
    description: 'Ändert den Prefix des Bots.',
    type: 'admin',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        if(args[0]) {
            const p = msg.content.split(' ')[1]
            p.match(/[a-z]/i)
            if(p.length <= 5) {
                serverdata[msg.guild.id].prefix = p
                fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                embeds.success(msg, "Prefix geändert!", `Der Prefix wurde erfolgreich zu \`${p}\` geändert.`)
            } else {
                embeds.error(msg, "Syntaxfehler", `${p} ist zu lang.\nBitte gib maximal 5 Zeichen an.`)
            }
        } else {
            embeds.syntaxerror(msg, 'prefix <Prefix>')
        }
    }
}
