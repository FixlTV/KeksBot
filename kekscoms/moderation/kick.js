const fs = require('fs')
const discord = require('discord.js')
const delay = require('delay')

module.exports = {
    commands: ['kick'],
    expectedArgs: '<@Nutzer> [Begründung]',
    minArgs: 1,
    permissions: 'KICK_MEMBERS',
    description: 'Kickt Leute',
    type: 'mod',
    addon: 'mod',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color, embeds) => {
        msg.delete()
        if(!msg.guild.me.hasPermission('KICK_MEMBERS')) {
            embeds.error(msg, 'Berechtigung fehlt', 'Ich kann keine Nutzer kicken.')
            return
        }
        if(!msg.mentions.members.first()) {
            embeds.error(msg, 'Syntaxfehler', `Bitte erwähne den zu kickenden Nutzer\n\`${serverdata[msg.guild.id].prefix}kick <@Nutzer>\``)
        }
        var member = msg.mentions.members.first()
        if(!member.kickable) {
            embeds.error(msg, 'Fehler', `Die Rollen von ${member.user} sind zu hoch.`)
            return
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} ${member.user.tag} wird gekickt...`)
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
        await member.kick(args.join(' ')).catch(async err => {
            embed.setColor(color.red)
            embed.setTitle(`${emotes.denied} Huch`)
            embed.setDescription('Ein Fehler ist aufgetreten.')
            message.edit(embed)
            await delay(5000)
            if(!message.deleted) return message.delete().catch()
        })
        embed.setColor(color.lime)
        embed.setTitle(`${member.user.tag} gekickt.`)
        embed.setDescription(`${member.user} wurde erfolgreich weggemacht.`)
        if(args.length > 0) embed.addField('Begründung', args.join(' '))
        await message.edit(embed)
        await delay(5000)
        if(!message.deleted) message.delete().catch()
    }
}