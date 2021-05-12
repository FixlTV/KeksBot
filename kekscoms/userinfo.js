const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')
const searchmembers = require('../subcommands/searchmembers')
const delay = require('delay')

module.exports = {
    commands: ['userinfo', 'uinfo'],
    description: 'Zeigt Informationen zu einem Nutzer an.',
    expectedArgs: '[@Nutzer]',
    type: 'info',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        const VIP = require('../VIP.json')
        msg.delete()
        var member
        var result = await searchmembers(msg, args, args.join(' '))
        if(result[0][0]) member = result[0][0]
        else member = msg.member 
        var id = member.id
        var roles = member.roles.cache.array()
        var temp = new Array()
        var guild = await client.guilds.fetch('775001585541185546')
        if(guild.members.cache.has(member.id)) {
            var team = member.roles.cache.has('779991897880002561')
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`Userinfo für ${member.user.username}`)
            .setDescription(`Hier sind ein paar Informationen über **${member}**`)
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true }))
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            .addField('ID', member.id, true)
            .addField('Discriminator', member.user.discriminator, true)
            .addField('Erstellungsdatum', `${member.user.createdAt.getDate()}.${member.user.createdAt.getMonth()+1}.${member.user.createdAt.getFullYear()} ${member.user.createdAt.getHours()}:${member.user.createdAt.getMinutes()}:${member.user.createdAt.getSeconds()}`, true)
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
        var message = await msg.channel.send(embed)
        await delay(45000)
        if(!message.deleted) message.delete()
        return
    }
}
