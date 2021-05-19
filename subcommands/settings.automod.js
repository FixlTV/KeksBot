const discord = require('discord.js')
const delay = require('delay')
const fs = require('fs').promises
const embeds = require('../embeds')
const linkify = require('linkifyjs')
const config = require('../config.json')
const whitelist = require('./automod/whitelist')
const roles = require('./automod/roles')
const channels = require('./automod/channels')

const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}

/**
 * Hallo Person, die diese Datei anschaut.
 * Du hast gerade ein Easter Egg gefunden.
 * Obwohl gar nicht Ostern ist.
 * Herzlichen Glückwunsch.
 */

module.exports = async (msg, args, client, serverdata) => {
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
        if(!args[2]) args[2] = ''
        if(['on', 'an', 'ein'].includes(args[2].toLowerCase())) {
            if(serverdata[guildid].amconfig.links && serverdata[guildid].amconfig.links.on) return embeds.error(msg, 'Fehler', 'Die Linkerkennung ist bereits aktiv')
            if(!serverdata[guildid].amconfig.links) {
                serverdata[guildid].amconfig.links = {
                    on: true,
                    linkwl: [],
                    channelwl: [],
                    rolewl: []
                }
            } else serverdata[guildid].amconfig.links.on = true
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return embeds.success(msg, 'Linkerkennung aktivert', `Links werden nun automatisch gelöscht.\nVerwende \`${serverdata[guildid].prefix}settings automod links\`, um das System anzupassen.\n**Achtung**: Die Linkerkennung löscht keine Discord Invites. Aktiviere bitte hierfür das Invite Modul (\`${serverdata[guildid].prefix}settings automod invite\`)`)
        } else if(['off', 'aus'].includes(args[2].toLowerCase())) {
            if(!serverdata[guildid].amconfig.links) return embeds.error(msg, 'Fehler', 'Die Linkerkennung ist nicht aktiv.')
            serverdata[guildid].amconfig.links.on = false
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return embeds.success(msg, 'Linkerkennung deaktiviert', 'Links werden nun nicht mehr gelöscht. Die Einstellungen wurden beibehalten.')
        } else if(['whitelist', 'wl'].includes(args[2].toLowerCase())) {
            if(!serverdata[guildid].amconfig.links) {
                serverdata[guildid].amconfig.links = {
                    on: false,
                    linkwl: [],
                    channelwl: [],
                    rolewl: []
                }
            }
            if(!args[3]) args[3] = ''
            await whitelist(msg, args, guildid, serverdata, client, color)
        } else if(['role', 'roles', 'r'].includes(args[2].toLowerCase())) {
            if(!serverdata[guildid].amconfig.links) {
                serverdata[guildid].amconfig.links = {
                    on: false,
                    linkwl: [],
                    channelwl: [],
                    rolewl: []
                }
            }
            if(!args[3]) args[3] = ''
            await roles(msg, args, guildid, serverdata, client, color)
        } else if(['channel', 'channels', 'c'].includes(args[2].toLowerCase())) {
            if(!serverdata[guildid].amconfig.links) {
                serverdata[guildid].amconfig.links = {
                    on: false,
                    linkwl: [],
                    channelwl: [],
                    rolewl: []
                }
            }
            if(!args[3]) args[3] = ''
            await channels(msg, args, guildid, serverdata, client, color)
        } else {
            var embed = new discord.MessageEmbed()
                .setColor(color.lightblue)
                .setTitle('Linkerkennung')
                .setDescription(`\`${serverdata[msg.guild.id].prefix}settings automod links\`\n\n\`<on || off>\`\nSchalte sie Linkerkennung ein oder aus.\n\`whitelist\`\nBearbeite die Liste der erlaubten Links. Diese können immer von jedem Nutzer gesendet werden.\n\`roles\`\nErlaube bestimmten Rollen, auch andere Links zu senden.\n\`channels\`\nErlaube allen Nutzern, in bestimmten Kanälen beliebige Links zu senden.\n\nModeratoren können immer alle Links senden.`)
                .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            var message = await msg.channel.send(embed)
            await delay(30000)
            if(!message.deleted) message.delete().catch()
            return
        }
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
            if(serverdata[guildid].amconfig.links.on) embed.addField('Linkentfernung', `**Aktiv**\nVerwende \`${serverdata[guildid].prefix}settings automod links\`, um die Erkennung von Links zu deaktivieren oder anzupassen.`)
            else embed.addField('Linkentfernung', `**Inaktiv**\nVerwende \`${serverdata[guildid].prefix}settings automod links on\`, um sie zu aktivieren oder \n\`${serverdata[guildid].prefix}settings automod links\`, um sie zu konfigurieren.`)
        }
        var message = await msg.channel.send(embed)
        await delay(20000)
        if(!message.deleted) message.delete().catch()
        return
    }
}