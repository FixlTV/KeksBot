const fs = require('fs')
const embeds = require('../../embeds')
const discord = require('discord.js')
const ignore = require('../../subcommands/cmdtype.settings.ignore')
const delay = require('delay')
const claim = require('../../subcommands/cmdtype.settings.claim')
const prefix = require('../../subcommands/cmdtype.settings.prefix')
const fcolor = require('../../subcommands/cmdtype.settings.color')
const kbspawn = require('../../subcommands/cmdtype.settings.kbspawn')
const automod = require('../../subcommands/cmdtype.settings.automod')

module.exports = {
    commands: ['settings', 'config'],
    permissions: 'MANAGE_MESSAGES',
    description: 'Konfiguriert die Servereinstellungen',
    expectedArgs: '[Einstellung] [Optionen]',
    type: 'admin',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        if(!serverdata[msg.guild.id]) return embeds.error(msg, 'Fehler', 'Für diesen Server sind keine Daten angelgt.\nUm diese Funktion zu nutzen, gib bitte `-activate main` ein.')
        if(!args[0]) args.push('')
        switch(args[0].toLowerCase()) {
            case 'ignore':
                if(!msg.member.hasPermission('MANAGE_CHANNELS') && !msg.author.hasPermission('MANAGE_ROLES')) {
                    embeds.needperms(msg, 'MANAGE_CHANNELS')
                    return
                }
                ignore(msg, args, client, serverdata)
                break
            case 'keksbox':
                if(!msg.member.hasPermission('MANAGE_CHANNELS')) {
                    embeds.needperms(msg, 'MANAGE_CHANNELS')
                    return
                }
                claim(msg, args, client, serverdata)
                break
            case 'prefix':
                if(!msg.member.hasPermission('MANAGE_GUILD')) return embeds.needperms(msg, 'MANAGE_GUILD')
                prefix(msg, args, client, serverdata)
                break
            case 'color':
                if(!msg.member.hasPermission('MANAGE_GUILD')) return embeds.needperms(msg, 'MANAGE_GUILD')
                args.shift()
                fcolor(msg, args, client, serverdata, color)
                break
            case 'kbspawn':
            case 'keksbox-spawn':
            case 'keksboxen-spawn':
                if(!msg.member.hasPermission('MANAGE_GUILD')) return embeds.needperms(msg, 'MANAGE_GUILD')
                args.shift()
                kbspawn(msg, args, client, serverdata)
                break
            case 'automod':
                automod(msg, args, client, serverdata)
                break
            default:
                var embed = new discord.MessageEmbed()
                    .setColor(color.lightblue)
                    .setTitle('⚙ Einstellungen')
                    .addField('Ignore', 'Lege Kanäle oder Rollen fest, in denen oder für die der Bot nicht funktioniert.', true)
                    .addField('KeksBox', 'Lege Kanäle fest, in denen KeksBoxen erstellt werden können.', true)
                    .addField('Prefix', 'Ändere den Bot Prefix.', true)
                    .addField('Color', 'Ändere die Farbe von den meisten Embeds.', true)
                    .addField('KekxBox-Spawn', 'Passe an, wie oft KeksBoxen auftauchen sollen', true)
                    .addField('Automod', 'Wende den Automod an. [WIP]', true)
                    .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
                var message = await msg.channel.send(embed)
                await delay(60000)
                if(!message.deleted) message.delete()
        }
    }
}