const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['userinfo'],
    description: 'Zeigt Informationen zu einem Nutzer an.',
    expectedArgs: '[@Nutzer]',
    type: 'info',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        const VIP = require('../VIP.json')
        msg.delete()
        var user = 0
        var member
        if(args[0]) {
            if(msg.mentions.members.first()) {
                user = msg.mentions.members.first()
            } else if(msg.guild.members.cache.find(u => u.user.username == args.join(' ')) != undefined) {
                user = msg.guild.members.cache.find(u => u.user.username == args.join(' '))
            } else if(msg.guild.members.cache.find(u => u.nickname == args.join(' ')) != undefined) {
                user = msg.guild.members.cache.find(u => u.nickname == args.join(' '))
            } else {
                user = msg.member
            }
        } else {
            user = msg.member
        }
        member = user
        var id = member.id
        var roles = member.roles.cache.array()
        var temp = new Array()
        var guild = await client.guilds.fetch('775001585541185546')
        if(guild.members.cache.has(member.id)) {
            var team = member.roles.cache.has('779991897880002561')
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`Userinfo für ${user.displayName}`)
            .setDescription(`Hier sind ein paar Informationen über **${member.user.username}**`)
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true }))
            .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
            .addField('ID', member.id, true)
            .addField('Discriminator', member.user.discriminator, true)
            .addField('Alter', `${member.user.createdAt.getDate()}.${member.user.createdAt.getMonth()+1}.${member.user.createdAt.getFullYear()} ${member.user.createdAt.getHours()}:${member.user.createdAt.getMinutes()}:${member.user.createdAt.getSeconds()}`, true)
            .addField('Serverbeitritt', `${member.joinedAt.getDate()}.${member.joinedAt.getMonth()+1}.${member.joinedAt.getFullYear()} ${member.joinedAt.getHours()}:${member.joinedAt.getMinutes()}:${member.joinedAt.getSeconds()}`, true)
            .addField('Rollen', roles.join(' '))
            if(userdata[member.id]) {
                embed.addField('Lagerstand', userdata[member.id].cookies, true)
                embed.addField('Erfahrungspunkte', userdata[member.id].xp, true)
                embed.addField('Level', userdata[member.id].lv, true)
                if(config.mods.includes(id)) {
                    temp.push(emotes.mod)
                }
                if(config.devs.includes(id)) {
                    temp.push(emotes.dev)
                }
                if(team) {
                    temp.push(emotes.team)
                }
                if(VIP[id] == 1) {
                    temp.push(emotes.vip)
                }
                if(userdata[id].partner) {
                    temp.push(emotes.partner)
                }
                if(userdata[id].firsthour == 1) {
                    temp.push(emotes.firsthour)
                }
                if(temp.length != 0) {
                    embed.addField('Abzeichen', temp.join(' '), true)
                }
            } else {
                embed.addField('Keine Daten', 'Für den Nutzer gibt es keine KeksBot Daten.')
            }
        msg.channel.send(embed)
        return
    }
}
