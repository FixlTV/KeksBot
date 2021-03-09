const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['gettan', 'tan', 'tans'],
    modonly: 1,
    description: 'Zeigt die aktuelle TAN an.',
    type: 'unlisted',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        var channel = await msg.author.createDM().catch(err => {
            embeds.error(msg, 'Fehler', 'Bei der Zustellung der Nachricht ist ein Fehler aufgetreten.\nBitte stelle sicher, dass der Bot dir Drektnachrichten schreiben kann.')
        })
        var embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle('TAN Anforderung')
            .setDescription(`Die aktuelle TAN lautet: **${config.tan}**\n`)
        channel.send(embed).catch(err => {
            embeds.error(msg, 'Fehler', 'Bei der Zustellung der Nachricht ist ein Fehler aufgetreten.\nBitte stelle sicher, dass der Bot dir Drektnachrichten schreiben kann.')
        })
    }
}