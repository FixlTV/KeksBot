const delay = require('delay')
const discord = require('discord.js')

module.exports = {
    commands: ['clear', 'purge', 'delete'],
    expectedArgs: '<Zahl>',
    minArgs: 1,
    maxArgs: 1,
    permissions: 'MANAGE_MESSAGES',
    description: 'Löscht bis zu 100 Nachrichten.',
    type: 'mod',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color, embeds) => {
        msg.delete().catch()
        if(!msg.guild.me.hasPermission('MANAGE_MESSAGES')) {
            embeds.error(msg, 'Keine Berechtigung', 'Ich kann keine Nachrichten löschen.')
            return
        }
        var count = args[0]
        if(isNaN(count)) {
            embeds.error(msg, 'Syntaxfehler', `Bitte gib eine Zahl an.\n\`${msg.content.split(' ')[0]} <Zahl>\``)
            return
        }
        if(count <= 0) {
            embeds.error(msg, 'Syntaxfehler', `Bitte gib eine positive Zahl an.\n\`${msg.content.split(' ')[0]} <Zahl>\``)
            return
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} Nachrichten werden gelöscht...`)
            .setDescription('Dies kann einige Zeit dauern...')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        if(count > 100) {count = 100}
        var messages = await msg.channel.messages.fetch({ limit: 100 })
        var message = await msg.channel.send(embed)
        messages = await msg.channel.messages.cache.filter(m => m.id != message.id && !m.pinned && !m.deleted).filter(m => (Date.now() - m.createdAt) < 1209600000).sort((a, b) => b.createdAt - a.createdAt).first(count)
        if(messages.length) var deleted = await msg.channel.bulkDelete(messages)
        if(deleted) {
            embed.setColor(color.lime)
            embed.setTitle(`${emotes.accept} Nachrichten gelöscht`)
            embed.setDescription(`${deleted.size} Nachrichten wurden erfolgreich gelöscht.`)
            await message.edit(embed)
        } else {
            embed.setColor(color.red)
            embed.setTitle(`${emotes.denied} Fehler`)
            embed.setDescription('Es wurden keine Nachrichten gelöscht.\nEs können keine Nachrichten gelöscht werden, die:\n • Älter als 14 Tage sind\n • Angepinnt sind\n • Aufgrund von fehlenden Berechtigungen nicht löschbar sind')
            await message.edit(embed)
        }
        await delay(5000)
        if(!message.deleted) message.delete().catch()
    }
}