const discord = require('discord.js')
const embeds = require('../embeds')
const emotes = require('../emotes.json')
const fs = require('fs')
const delay = require('delay')
const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}
const config = require('../config.json')

module.exports = async (msg, args, client, serverdata) => {
    var temp = 0
    var ac = []
    var rc = []
    if(!serverdata[msg.guild.id].cwl) serverdata[msg.guild.id].cwl = []
    if(msg.mentions.channels.size > 0) {
        var channels = msg.mentions.channels.array()
        channels.forEach(channel => {
            if(serverdata[msg.guild.id].cwl.includes(channel.id)) {
                if(temp == 0 || temp == 2) temp = temp + 1
                var index = serverdata[msg.guild.id].cwl.indexOf(channel.id)
                serverdata[msg.guild.id].cwl.splice(index, 1)
                rc.push(`<#${channel.id}>`)
            } else {
                if(temp == 0 || temp == 1) temp = temp + 2
                serverdata[msg.guild.id].cwl.push(channel.id)
                ac.push(`<#${channel.id}>`)
            }
        })
        fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
        var temp_ = []
        serverdata[msg.guild.id].cwl.forEach(id => {
            temp_.push(`<#${id}>`)
        })
        if(temp_.length == 0) temp_.push('Es werden keine KeksBoxen generiert.')
        var embed = new discord.MessageEmbed().setColor(color.lightblue).setTitle('KeksBoxen Spawnverhalten geändert').setDescription('Die Daten wurden erfolgreich überschrieben.').setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        if(temp == 0) {
            return embeds.error(msg, 'Nicht der Keks nachdem du gesucht hast', 'Irgendwas ist wohl schief gelaufen.')
        } else if(temp == 1) {
            embed.addField('Entfernte Kanäle', rc.join(', '), true)
        } else if(temp == 2) {
            embed.addField('Hinzugefügte Kanäle', ac.join(', '), true)
        } else if(temp == 3) {
            embed.addField('Hinzugefügte Kanäle', ac.join(', '), true)
            embed.addField('Entfernte Kanäle', rc.join(', '), true)
        }
        embed.addField('KeksBox Channel', temp_.join(', '), true)
        var message = await msg.channel.send(embed)
        await delay(15000)
        if(!message.deleted) message.delete().catch()
    } else {
        if(serverdata[msg.guild.id].cwl && serverdata[msg.guild.id].cwl.length != 0) {
            temp = []
            serverdata[msg.guild.id].cwl.forEach(id => {
                temp.push(`<#${id}>`)
            })
            var embed = new discord.MessageEmbed()
                .setColor(color.lightblue)
                .setTitle('KeksBoxen Whitelist')
                .setDescription('Aktuell werden in diesen Kanälen KeksBoxen generiert:')
                .addField(`Anzahl: ${serverdata[msg.guild.id].cwl.length}`, temp.join(', '))
                .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            var message = await msg.channel.send(embed)
            await delay(15000)
            if(!message.deleted) message.delete().catch()
        } else {
            var embed = new discord.MessageEmbed()
                .setColor(color.lightblue)
                .setTitle('KeksBoxen Whitelist')
                .setDescription(`Aktuell werden keine KeksBoxen generiert.\nVerwende \`${serverdata[msg.guild.id].prefix}settings claimwhitelist <#channel> [#channel] [#channel] ...\`, um KeksBoxen zu aktivieren.`)
                .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            var message = await msg.channel.send(embed)
            await delay(15000)
            if(!message.deleted) message.delete().catch()
        }
    }
}