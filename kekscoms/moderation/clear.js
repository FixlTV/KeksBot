const fs = require('fs')
const discord = require('discord.js')

module.exports = {
    commands: ['clear', 'purge', 'delete'],
    expectedArgs: '<Zahl>',
    minArgs: 1,
    maxArgs: 1,
    permissions: 'MANAGE_MESSAGES',
    description: 'Löscht bis zu 100 Nachrichten.',
    type: 'mod',
    addon: 'mod',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color, embeds) => {
        msg.delete()
        if(!msg.guild.me.hasPermission('MANAGE_MESSAGES')) {
            embeds.error(msg, 'Keine Berechtigung', 'Ich kann keine Nachrichten löschen.')
            return
        }
        var count = args[0]
        if(isNaN(count)) {
            embeds.error(msg, 'Syntaxfehler', `Bitte gib eine Zahl an.\n\`${msg.content.split(' ')[0]} **<Zahl>**\``)
            return
        }
        if(count <= 0) {
            embeds.error(msg, 'Syntaxfehler', `Bitte gib eine positive Zahl an.\n\`${msg.content.split(' ')[0]} **<Zahl>**\``)
            return
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} Nachrichten werden gelöscht...`)
            .setDescription('Dies kann einige Zeit dauern...')
            .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
        if(count > 100) {count = 100}
        var messages = await msg.channel.messages.fetch({ limit: 100 })
        var message = await msg.channel.send(embed)
        messages = await msg.channel.messages.cache.filter(m => m.id !== message.id && !m.pinned && m.id !== msg.id).first(count)
        console.log(messages)
        messages.forEach(message => {
            message.delete({reason: 'Bulk Delete'})
        })
        embed.setColor(color.lime)
        embed.setTitle(`${emotes.accept} Nachrichten gelöscht`)
        embed.setDescription(`${count} Nachrichten wurden erfolgreich gelöscht.`)
        message.edit(embed).then(msg => msg.delete({ timeout: 5000 }))
    }
}