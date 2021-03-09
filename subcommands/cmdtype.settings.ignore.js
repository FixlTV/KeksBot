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
    var temp_ = 0
    var ac = new Array()
    var ar = new Array()
    var rc = new Array()
    var rr = new Array()
    if(!serverdata[msg.guild.id].ic) serverdata[msg.guild.id].ic = []
    if(!serverdata[msg.guild.id].ir) serverdata[msg.guild.id].ir = []
    if(msg.member.hasPermission('MANAGE_CHANNELS')) {
        if(msg.mentions.channels) {
            var channels = msg.mentions.channels.array()
            channels.forEach(channel => {
                if(serverdata[msg.guild.id].ic.includes(channel.id)) {
                    if(temp == 0 || temp == 2) temp = temp + 1
                    var index = serverdata[msg.guild.id].ic.indexOf(channel.id)
                    serverdata[msg.guild.id].ic.splice(index, 1)
                    rc.push(`<#${channel.id}>`)
                } else {
                    if(temp == 0 || temp == 1) temp = temp + 2
                    serverdata[msg.guild.id].ic.push(channel.id)
                    ac.push(`<#${channel.id}>`)
                }
            })
        }
    }
    if(msg.member.hasPermission('MANAGE_ROLES')) {
        if(msg.mentions.roles) {
            var roles = msg.mentions.roles.array()
            roles.forEach(role => {
                if(serverdata[msg.guild.id].ir.includes(role.id)) {
                    if(temp_ == 0 || temp_ == 2) temp_ = temp_ + 1
                    var index = serverdata[msg.guild.id].ir.indexOf(role.id)
                    serverdata[msg.guild.id].ir.splice(index, 1)
                    rr.push(`<@&${role.id}>`)
                } else {
                    if(temp_ < 2) temp_ = temp_ + 2
                    serverdata[msg.guild.id].ir.push(role.id)
                    ar.push(`<@&${role.id}>`)
                }
            })
        }
    }
    fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
    if(temp == 0 && temp_ == 0) {
        var cs = new Array()
        var rs = new Array()
        serverdata[msg.guild.id].ic.forEach(channel => {
            cs.push(`<#${channel}>`)
        })
        serverdata[msg.guild.id].ir.forEach(role => {
            rs.push(`<@&${role}>`)
        })
        if(rs.length == 0) rs.push('Es werden keine Rollen ignoriert.')
        if(cs.length == 0) cs.push('Es werden keine Kanäle ignoriert.')
        var embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle('Aktuell ignoriert')
            .addField('Kanäle', `${cs.join(', ')}`, true)
            .addField('Rollen', `${rs.join(', ')}`, true)
            .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        await delay(15000)
        if(!message.deleted) message.delete()
        return
    }
    var embed = new discord.MessageEmbed()
        .setColor(color.lightblue)
        .setTitle('Daten überschrieben')
        .setDescription('Die Daten für ignorierte Kanäle und Rollen wurden erfolgreich geändert.')
        .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
    if(temp == 1) {
        embed.addField('Entfernte Kanäle', rc.join(', '), true)
    } else if(temp == 2) {
        embed.addField('Hinzugefügte Kanäle', ac.join(', '), true)
    } else if(temp == 3) {
        embed.addField('Hinzugefügte Kanäle', ac.join(', '), true)
        embed.addField('Entfernte Kanäle', rc.join(', '), true)
    }
    if(temp_ == 1) {
        embed.addField('Entfernte Rollen', rr.join(', '), true)
    } else if(temp_ == 2) {
        embed.addField('Hinzugefügte Rollen', ar.join(', '), true)
    } else if(temp_ == 3) {
        embed.addField('Hinzugefügte Rollen', ar.join(', '), true)
        embed.addField('Entfernte Rollen', rr.join(', '), true)
    }
    var message = await msg.channel.send(embed)
    await delay(10000)
    if(!message.deleted) message.delete()
}