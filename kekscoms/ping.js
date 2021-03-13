const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['ping', 'pong'],
    description: 'Zeigt die Bot- und API-Latenz an.',
    type: 'info',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
            var message
            msg.delete()
            var embed = new discord.MessageEmbed()
                .setColor(color.yellow)
                .setTitle(`${emotes.pinging} Pinging...`)
                .setDescription('Ich berechne gerade den Ping.\nDies kann einige Zeit dauern...')
                .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            msg.channel.send('',embed).then(resultmsg => {
                var ping = resultmsg.createdTimestamp - msg.createdTimestamp
                embed.setTitle(`${emotes.ping} Pong!`)
                embed.setDescription(`:hourglass: Latenz: ${ping} ms\n:stopwatch: API Latenz: ${client.ws.ping} ms`)
                if(ping < 20) {
                    embed.setColor(color.normal)
                } else { //Farbauswahl
                    if(ping < 200) {
                        embed.setColor(color.lime)
                    } else {
                        if(ping < 500) {
                            embed.setColor(color.yellow)
                        } else {
                            if(ping < 1000) {
                                embed.setColor(color.red)
                            } else {
                                embed.setColor(0x9c0010)
                            }
                        }
                    }
                }
                resultmsg.edit('',embed).then(resultmsg =>        
                    setTimeout(msg => {
                        if(!msg.deleted) {msg.delete()}
                    }, 10000, resultmsg)
                )
                message = msg
            })
            return Promise.resolve(message)
    }
}
