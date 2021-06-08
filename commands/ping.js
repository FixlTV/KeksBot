const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')
const delay = require('delay')

module.exports = {
    commands: ['ping', 'pong'],
    description: 'Zeigt die Bot- und API-Latenz an.',
    type: 'info',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
            msg.delete()
            var embed = new discord.MessageEmbed()
                .setColor(color.yellow)
                .setTitle(`${emotes.pinging} Pinging...`)
                .setDescription('Ich berechne gerade den Ping.\nDies kann einige Zeit dauern...')
                .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            var resultmsg = await msg.channel.send('',embed)
            var ping = resultmsg.createdTimestamp - msg.createdTimestamp
            embed.setTitle(`${emotes.ping} Pong!`)
            embed.setDescription(`:hourglass: Latenz: ${ping} ms\n:stopwatch: API Latenz: ${client.ws.ping} ms`)
            if(ping < 20) {
                embed.setColor(color.normal)
            } else if(ping < 200) {
                embed.setColor(color.lime)
            } else if(ping < 500) {
                embed.setColor(color.yellow)
            } else if(ping < 1000) {
                embed.setColor(color.red)
            } else {
                embed.setColor(0x9c0010)
            }
            resultmsg.edit('',embed).then(async resultmsg => { 
                await delay(10000)
                if(!resultmsg.deleted) resultmsg.delete().catch() 
            })
            return Promise.resolve(msg)
    }
}
