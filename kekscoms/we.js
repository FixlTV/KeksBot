const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['we'],
    description: 'Serverinfo nur mit weniger Informationen (EP, Level)',
    type: 'user',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        var message
        msg.delete()
        try {
            var name = []
            var level = serverdata[msg.guild.id].lv
            name.push(msg.guild.name)
            if(serverdata[msg.guild.id].partner >= 1) {
                name.unshift(emotes.partnerserver)
            }
            if(serverdata[msg.guild.id].verified == 1) {
                name.unshift(emotes.verifiedserver)
            }
            var embed = new discord.MessageEmbed()
                .setTitle(name.join(' '))
                .addField('Erfahrungspunkte', serverdata[msg.guild.id].xp, true)
                .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                .setColor(color.normal)
                .setThumbnail(msg.guild.iconURL())
            if(level > 5) {
                level = 5
            }
            embed.addField('Level', level, true)
            msg.channel.send(embed).then(msg =>         
                setTimeout(msg => {
                    if(!msg.deleted) {msg.delete()}
                }, 10000, msg)
            )
        } catch (err) {
            embeds.error(msg, "Fehler", "Ein Fehler ist aufgetreten. \nWahrscheinlich ist das Keks System auf eurem Server noch nicht aktiviert.\nUm das nachzuholen, muss ein Administrator ``-activate`` eingeben.")
        }
    }
}
