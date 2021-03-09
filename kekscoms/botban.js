const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['banuser', 'botban'],
    expectedArgs: '<User ID>',
    minArgs: 1,
    maxArgs: 1,
    modonly: 1,
    description: 'Deaktiviert Commands für einen Nutzer',
    type: 'unlisted',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        var user
        try{
            user = msg.mentions.users.first()
        } catch (err) {
            console.error(err)
        }
        if(user == undefined && !isNaN(args[0])) {
            try{
                user = await client.users.fetch(args[0])
            } catch (err) {
                embeds.error(msg, '404', 'Nutzer nicht gefunden')
                return
            }
        }
        if(!userdata[user.id]) {
            userdata[user.id] = {}
        }
        userdata[user.id].banned = 1
        fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle(`${emotes.accept} Botnutzung erfolgreich deaktiviert.`)
            .setDescription(`Der Nutzer **${user.tag}** wurde erfolgreich gebannt.`)
        msg.channel.send(embed).then(msg =>         
            setTimeout(msg => {
                if(!msg.deleted) {msg.delete()}
            }, 3000, msg)
        )
        return
    }
}