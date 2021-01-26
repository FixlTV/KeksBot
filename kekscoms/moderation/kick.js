const fs = require('fs')
const discord = require('discord.js')

module.exports = {
    commands: ['kick'],
    expectedArgs: '<@Nutzer>',
    minArgs: 1,
    maxArgs: 1,
    permissions: 'MANAGE_MESSAGES',
    description: 'Löscht bis zu 100 Nachrichten.',
    type: 'mod',
    addon: 'mod',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color, embeds) => {
        if(!msg.guild.me.hasPermission('KICK_MEMBERS')) {
            embeds.error(msg, 'Berechtigung fehlt', 'Ich kann keine Nutzer kicken.')
            return
        }
        if(!msg.mentions.members.first()) {
            embeds.error(msg, 'Syntaxfehler', `Bitte erwähne den zu kickenden Nutzer\n\`${msg.content.split(' ')[1]} **<@Nutzer>**\``)
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
    }
}