const delay = require("delay")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'checkpermissions',
    commands: ['checkperms', 'perms', 'permissions'],
    permission: 'ADMINISTRATOR',
    type: 'admin',
    description: 'Überprüft die Berechtigungen des Bots. Sinnvoll, wenn Fehler beim ausführen mancher Commands auftreten.',
    async callback(msg, args, client, serverdata, userdata, config, emotes, color) {
        if(msg.deletable) msg.delete().catch()
        var perms = {
            __Nachrichten_verwalten: msg.guild.me.hasPermission('MANAGE_MESSAGES'),
            __Reaktionen_hinzufügen: msg.guild.me.hasPermission('ADD_REACTIONS'),
            __Externe_Emojis_verwenden: msg.guild.me.hasPermission('USE_EXTERNAL_EMOJIS'),
            Mitglieder_kicken: msg.guild.me.hasPermission('KICK_MEMBERS'),
            Mitglieder_bannen: msg.guild.me.hasPermission('BAN_MEMBERS')
        }
        for(let k in perms) {
            if(perms[k]) perms[k] = `${emotes.accept}`
            else perms[k] = `${emotes.denied}`
        }
        var allPermissions = `${emotes.accept} Alle benötigten Berechtigungen sind erteilt.`
        for(let k in perms) {
            if(perms[k] === `${emotes.denied}`) allPermissions = '⚠ Nicht alle benötigten Berechtigungen sind erteilt.'
        }
        var text = 'Hier ist eine Auflistung aller benötigten Berechigungen und ihr aktueller Status:\n'
        for(let k in perms) {
            text += '\n'
            text += `${k.replaceAll('__', '⚠ ').replaceAll('_', ' ')}: ${perms[k]}`
        }
        let embedcolor = color.lime
        if(allPermissions.includes('⚠')) embedcolor = color.yellow
        let embed = new MessageEmbed()
            .setColor(embedcolor)
            .setTitle(allPermissions)
            .setDescription(text)
            .setFooter(`KeksBot ${config.version} | Berechtigungen mit einem ⚠-Zeichen sind notwendig, andere optional.`, client.user.avatarURL())
        let message = await msg.channel.send(embed)
        await delay(20000)
        if(!message.deleted) message.delete().catch()
    }
}