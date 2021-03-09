const fs = require('fs')
const discord = require('discord.js')
const delay = require('delay')

module.exports = {
    commands: ['ban'],
    expectedArgs: '<@Nutzer | ID> [Begründung]',
    minArgs: 1,
    permissions: 'BAN_MEMBERS',
    description: 'Bannt Leute',
    type: 'mod',
    addon: 'mod',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color, embeds) => {
        msg.delete()
        if(!msg.guild.me.hasPermission('BAN_MEMBERS')) {
            embeds.error(msg, 'Berechtigung fehlt', 'Ich kann keine Nutzer kicken.')
            return
        }
        if(!msg.mentions.members.first()) {
            if(!isNaN(args[0])) {
                var user = await client.users.fetch(args[0])
                if(!user) return embeds.error(msg, 'Fehler', `\`${args[0]}\` ist keine gültige ID.`)
            } else return embeds.error(msg, 'Syntaxfehler', `Bitte erwähne den zu kickenden Nutzer\n\`${serverdata[msg.guild.id].prefix}ban <@Nutzer> [Begründung]\``)
        }
        var member = msg.mentions.members.first()
        if(member) {
            if(!member.bannable) {
                embeds.error(msg, 'Fehler', `Die Rollen von ${member.user} sind zu hoch.`)
                return
            }
            var embed = new discord.MessageEmbed()
                .setColor(color.yellow)
                .setTitle(`${emotes.pinging} ${member.user.tag} wird gebannt...`)
                .setDescription('Dies kann einige Zeit dauern')
                .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
            var message = await msg.channel.send(embed)
    
            if(!(msg.guild.owner.id == msg.author.id) && msg.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                embed.setColor(color.red)
                embed.setDescription(`Du kannst keine Moderatoren kicken.`)
                embed.setTitle(`${emotes.denied} Keine Berechtigung`)
                return message.edit(embed)
            }    
            args.shift()
            await msg.guild.members.ban(member, {reason: args.join(' '), days: 7}).catch(async err => {
                embed.setColor(color.red)
                embed.setTitle(`${emotes.denied} Huch`)
                embed.setDescription('Ein Fehler ist aufgetreten.')
                message.edit(embed)
                await delay(5000)
                if(!message.deleted) return message.delete().catch()
            })
        } else if(user) {
            var embed = new discord.MessageEmbed()
                .setColor(color.yellow)
                .setTitle(`${emotes.pinging} ${user.tag} wird gebannt...`)
                .setDescription('Dies kann einige Zeit dauern')
                .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
            var message = await msg.channel.send(embed)
            args.shift()
            await msg.guild.members.ban(user.id, {reason: args.join(' '), days: 7}).catch(async err => {
                embed.setColor(color.red)
                embed.setTitle(`${emotes.denied} Huch`)
                embed.setDescription('Ein Fehler ist aufgetreten.')
                message.edit(embed)
                await delay(5000)
                if(!message.deleted) return message.delete().catch()
            })
        } else {
            embeds.error(msg, 'Fehler', 'Ein Fehler ist aufgetreten.\nBitte stelle sicher, dass du einen Nutzer angegeben hast.')
        }
        embed.setColor(color.lime)
        embed.setTitle(`${user.tag} gebannt`)
        embed.setDescription(`${user.username} wurde erfolgreich weggeräumt.`)
        embed.setImage('https://cdn.discordapp.com/attachments/775001585541185550/814813411900129320/banned.gif')
        if(args.length > 0) embed.addField('Begründung', args.join(' '))
        await message.edit(embed)
        await delay(5000)
        if(!message.deleted) message.delete().catch()
    }
}