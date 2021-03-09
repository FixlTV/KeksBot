const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['me'],
    description: 'Zeigt Kekse im Lager, Erfahrungspunkte und Level an.',
    type: 'user',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        try {
            var name = []
            name.push(msg.author.username)
            if(userdata[msg.author.id].partner >= 1) {
                name.unshift(emotes.partnerlogo)
            }
            var embed = new discord.MessageEmbed()
                .setTitle(name.join(' '))
                .addField('Gelagert', userdata[msg.author.id].cookies, true)
                .addField('Erfahrungspunkte', userdata[msg.author.id].xp, true)
                .addField('Level', userdata[msg.author.id].lv, true)
                .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                .setColor(color.normal)
                .setThumbnail(msg.author.avatarURL())
            msg.channel.send(embed).then(msg =>         
                setTimeout(msg => {
                    if(!msg.deleted) {msg.delete()}
                }, 10000, msg)
            )
        } catch (err) {
            embeds.error(msg, "Fehler", "Ein Fehler ist aufgetreten.\nVermutlich, weil für dich noch keine Daten angelegt wurden.")
        }
    }
}
