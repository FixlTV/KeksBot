const discord = require('discord.js')
const delay = require('delay')
const fs = require('fs').promises
const embeds = require('../embeds')
const config = require('../config.json')

/**
 * Hallo Person, die diese Datei anschaut.
 * Du hast gerade ein Easter Egg gefunden.
 * Obwohl gar nicht Ostern ist.
 * Herzlichen Glückwunsch.
 */

module.exports = async (msg, args, client, serverdata) => {
    var color = require('./getcolor')(msg, serverdata)
    const emotes = require('../emotes.json')
    var guildid = msg.guild.id
    if(!args[1]) args[1] = ''
    if(!serverdata[guildid].amconfig) serverdata[guildid].amconfig = {}
    if(['on', 'an', 'ein'].includes(args[1].toLowerCase())) { //Automod aktivieren
        if(serverdata[guildid].automod) return embeds.error(msg, 'Fehler', 'Der AutoMod ist bereits aktiv.')
        serverdata[guildid].automod = true
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        return embeds.success(msg, 'AutoMod aktiviert', 'Der AutoMod ist nun aktiv. Verwende `' + serverdata[guildid].prefix + 'settings automod`, um die einzelnen Systeme anzupassen.')
    } else if(['off', 'aus'].includes(args[1].toLowerCase())) { //Automod deaktivieren
        if(!serverdata[guildid].automod) return embeds.error(msg, 'Fehler', 'Der AutoMod ist bereits deaktiviert.')
        delete serverdata[guildid].automod
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        return embeds.success(msg, 'AutoMod deaktiviert', 'Der AutoMod ist jetzt aus. Deine Einstellungen wurden jedoch gespeichert.')
    } else if(['links', 'link'].includes(args[1].toLowerCase())) {//Linkdetection
        await require('./automod/linkdetection')(msg, args, serverdata, color)
    } else if(['dlinks', 'dlink', 'dl'].includes(args[1].toLowerCase())) {//Discord Linkdetection
        await require('./automod/dlinkdetection')(msg, args, serverdata, color)
    } else { //Startseite
        var embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle('AutoMod')
            .setDescription('Hier ist der aktuelle AutoMod Status:')
            .setFooter(`KeksBot ${config.version}`)
        if(!serverdata[guildid].automod) {
            embed.addField('AutoMod', `**Inaktiv**\nBenutze \`${serverdata[guildid].prefix}settings automod on\`, um ihn zu aktivieren.`)
        } else {
            embed.addField('AutoMod', `**Aktiv**\nVerwende \`${serverdata[guildid].prefix}settings automod off\`, um ihn zu deaktivieren.`)
            if(serverdata[guildid].amconfig.links && serverdata[guildid].amconfig.links.on) embed.addField('Linkerkennung', `**Aktiv**\nVerwende \`${serverdata[guildid].prefix}settings automod links\`, um die Erkennung von Links zu deaktivieren oder anzupassen.`, true)
            else embed.addField('Linkentfernung', `**Inaktiv**\nVerwende \`${serverdata[guildid].prefix}settings automod links on\`, um sie zu aktivieren oder \n\`${serverdata[guildid].prefix}settings automod links\`, um sie zu konfigurieren.`, true)
            if(serverdata[guildid].amconfig.dlinks && serverdata[guildid].amconfig.dlinks.on) embed.addField(`Discord Links', '**Aktiv**\nVerwende \`${serverdata[guildid].prefix}settings automod dlinks\`, um die Erkennung von besonderen Discord Links (Einladungen, Nitro Gifts, Nachrichten, Bilder, etc) zu deaktivieren oder anzupassen.`, true)
            else embed.addField('Discord Links', `**Inaktiv**\nVerwende \`${serverdata[guildid].prefix}settings automod links on\`, um die Erkennung von besonderen Discord Links (Einladungen, Nachrichten, Bilder, etc) zu aktivieren oder \n\`${serverdata[guildid].prefix}settings automod dlinks\`, um sie zu konfigurieren.`, true)
        }
        var message = await msg.channel.send(embed)
        await delay(20000)
        if(!message.deleted) message.delete().catch()
        return
    }
}