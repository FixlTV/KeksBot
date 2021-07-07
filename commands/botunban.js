const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['pardonuser', 'botunban', 'userunban', 'botpardon', 'unbanuser', 'userpardon'],
    expectedArgs: '<User ID>',
    minArgs: 1,
    maxArgs: 1,
    modonly: 1,
    description: 'Reaktiviert Commands für einen Nutzer',
    type: 'modonly',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        var user = undefined
        try{
            user = msg.mentions.users.first()
        } catch (err) {}
        if(user == undefined && !isNaN(args[0])) {
            try {
                user = await client.users.fetch(args[0])
            } catch (err) {
                embeds.error(msg, '404', 'Nutzer nicht gefunden')
                return
            }
        }
        if(userdata[user.id].banned == 1) {
            delete userdata[user.id].banned
            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
            embeds.success(msg, 'Nutzer entbannt', `${user.tag} ist nun nich mehr gebannt.`)
        } else {
            embeds.error(msg, 'Fehler', 'Dieser Nutzer ist nicht gebannt.')
        }
    }
}