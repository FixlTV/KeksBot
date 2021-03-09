const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')
const si      = require('systeminformation')

module.exports = {
    commands: ['botstats'],
    modonly: 1,
    description: 'Zeigt Serverauslastung an [WIP]',
    type: 'unlisted', 
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        var used = process.memoryUsage()
        var embedx = new discord.MessageEmbed()
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} Lade Daten...`)
            .setDescription(`Dies kann einige Zeit dauern...`)
        msg.channel.send(embedx).then(resultmsg => {
            si.cpu().then(cpu => {
                si.cpuTemperature().then(cpuTemperature => {
                    si.cpuCurrentspeed().then(cpuCurrentspeed => {
                        var embed = new discord.MessageEmbed()
                            .setColor(color.normal)
                            .setTitle('Aktuelle Serverauslastung')
                            .addField('RAM-Auslastung',`**RSS:** ${used.rss / 1024 / 1024 / 1024} GB\n**HeapTotal:** ${used.heapTotal / 1024 / 1024 / 1024} GB\n**HeapUsed:** ${used.heapUsed / 1024 / 1024 / 1024} GB\n**External:** ${used.external / 1024 / 1024 / 1024} GB`, true)
                            .addField('CPU-Auslastung', `**Durchschnitt (Kerne):** ${cpuCurrentspeed.avg} GHz\n**Höchstgeschwindigkeit:** ${cpuCurrentspeed.max} GHz\n**Niedrigste Geschwindigkeit:** ${cpuCurrentspeed.min} GHz\n**Alle Kerne:** ${cpuCurrentspeed.cores.join(' GHz, ')} GHz\n**Maximale Geschwindigkeit:** ${cpu.speedmax} GHz\n**Minimale Geschwindigkeit:** ${cpu.speedmin} GHz`, true)
                            .addField('CPU-Temperatur', `**CPU-Temperatur:** ${cpuTemperature.main} K\n**Maximaltemperatur (Kerne):** ${cpuTemperature.max} K`, true)
                        resultmsg.edit(embed).then(msg =>         
                            setTimeout(msg => {
                                if(!msg.deleted) {msg.delete()}
                            }, 30000, msg)
                        )
                    })
                })
            })
        })
    }
}
