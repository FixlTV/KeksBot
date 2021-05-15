const discord = require('discord.js')
const delay = require('delay')
const fs = require('fs').promises
const embeds = require('../embeds')
const linkify = require('linkifyjs')
const config = require('../config.json')

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
                    on: true,
                    linkwl: [],
                    channelwl: [],
                    rolewl: []
                }
            }
            if(!args[3]) args[3] = ''
            switch(args[3].toLowerCase()) {
                case 'a':
                case 'add': 
                    if(!args[4]) return embeds.error(msg, 'Fehler', 'Bitte gib mindestens einen Link an.\n`' + serverdata[guildid].prefix + 'settings automod links whitelist add <Link 1> [Link 2] [Link 3] [Link n]`')
                    var links = args.slice(4)
                    var validlink = linkify.find(links.join(' '))
                    var addedlinks = []
                    validlink.forEach(url => {
                        url = url.href.split('/').slice(0, 3).join('/')
                        links.forEach((link, index) => {
                            if(url.includes(link) && !serverdata[guildid].amconfig.links.linkwl.includes(url.replace('www.', '').replace('https:', 'http:'))) {
                                serverdata[guildid].amconfig.links.linkwl.push(url.replace('www.', '').replace('https:', 'http:'))
                                addedlinks.push(url.replace('www.', '').replace('https:', 'http:'))
                            }
                        })
                    })
                    if(addedlinks.length == 0) return embeds.error(msg, 'Fehler', 'Alle angegebenen Links sind bereits auf der Whitelist')
                    await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                    return embeds.success(msg, 'Whitelist geändert', 'Die Whitelist wurde erweitert:\n' + addedlinks.join('\n'))
                    break
                case 'r':
                case 'remove':
                    if(!args[4]) return embeds.error(msg, 'Fehler', 'Bitte gib mindestens einen Link an.\n`' + serverdata[guildid].prefix + 'settings automod links whitelist add <Link 1> [Link 2] [Link 3] [Link n]`')
                    var links = args.slice(4)
                    var validlink = linkify.find(links.join(' '))
                    var removedlinks = []
                    validlink.forEach(url => {
                        url = url.href.split('/').slice(0, 3).join('/')
                        links.forEach((link, index) => {
                            if(url.includes(link) && serverdata[guildid].amconfig.links.linkwl.includes(url.replace('www.', '').replace('https:', 'http:'))) {
                                serverdata[guildid].amconfig.links.linkwl.splice(serverdata[guildid].amconfig.links.linkwl.indexOf(url.replace('www.', '').replace('https:', 'http:')), 1)
                                removedlinks.push(url.replace('www.', '').replace('https:', 'http:'))
                            }
                        })
                    })
                    await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                    if(links.length == 0) return embeds.error(msg, 'Keine Links entfernt', 'Alle angegebenen Links sind bereits verboten.')
                    return embeds.success(msg, 'Links entfernt', `Folgende Links sind nun nicht mehr auf der Whitelist:\n${removedlinks.join('\n')}`)
                case 'l':
                case 'list':
                    if(serverdata[guildid].amconfig.links.linkwl.length == 0) return embeds.error(msg, 'Link Whitelist', 'Es sind keine Links gewhitelistet.')
                    if(serverdata[guildid].amconfig.links.linkwl.length <= 10) {
                        var embed = new discord.MessageEmbed()
                            .setColor(color.lightblue)
                            .setTitle('Link Whitelist')
                            .setDescription(`Dies ist eine Liste aller erlaubten Links:\n${serverdata[guildid].amconfig.links.linkwl.join('\n')}`)
                            .setFooter(`KeksBot ${config.version}`)
                        var message = await msg.channel.send(embed)
                        await delay(20000)
                        if(!message.deleted) message.delete().catch()
                    } else {
                        const changePage = async (m, links, pageN, modifier) => {
                            if((pageN == 0 && modifier == 1) || (pageN == Math.floor((links.length - 1) / 10) && modifier == -1) || (0 < pageN < Math.floor((links.length - 1) / 10))) pageN = pageN + modifier
                            links = links.slice(pageN * 10, pageN * 10 +10)
                            var embed = new discord.MessageEmbed()
                                .setColor(color.lightblue)
                                .setTitle(`Link Whitelist | Seite ${pageN + 1}`)
                                .setDescription(`Dies ist eine Liste aller erlaubten Links:\n${links.join('\n')}`)
                                .setFooter(`KeksBot ${config.version} | Zeige Einträge ${pageN * 10 + 1} bis ${pageN * 10 + 10}`)
                            await m.edit(embed)
                            return pageN
                        }
                        let page = 0
                        var links = serverdata[guildid].amconfig.links.linkwl.slice(page * 10, page * 10 + 10)
                        var embed = new discord.MessageEmbed()
                            .setColor(color.lightblue)
                            .setTitle(`Link Whitelist | Seite ${page + 1}`)
                            .setDescription(`Dies ist eine Liste aller erlaubten Links:\n${links.join('\n')}`)
                            .setFooter(`KeksBot ${config.version} | Zeige Einträge ${page * 10 + 1} bis ${page * 10 + 10}`)
                        var message = await msg.channel.send(embed)
                        const filter = (reaction, user) => user.id === msg.author.id
                        links = serverdata[guildid].amconfig.links.linkwl
                        const collector = await message.createReactionCollector(filter, { time: 180000 })
                        collector.on('collect', async (r, u) => {
                            if(u.id === client.user.id) return
                            switch(r.emoji.name) {
                                case '◀': 
                                    page = await changePage(message, links, page, -1)
                                    r.users.remove(msg.author)
                                    break
                                case '▶':
                                    page = await changePage(message, links, page, 1)
                                    r.users.remove(msg.author)
                                    break
                                case '⏪':
                                    page = await changePage(message, links, 0, 0)
                                    r.users.remove(msg.author)
                                    break
                                case '⏩':
                                    page = await changePage(message, links, Math.floor((links.length - 1) / 10), 0)
                                    r.users.remove(msg.author)
                                    break
                                case '⏹': 
                                    await r.message.reactions.removeAll()
                                    await delay(30000)
                                    if(!message.deleted) message.delete().catch()
                                    break
                                default: 
                                    r.users.remove(msg.author)
                            }
                        })
                        await message.react('⏪')
                        await message.react('◀')
                        await message.react('⏹')
                        await message.react('▶')
                        await message.react('⏩')
                        await delay(180000)
                        if(message.deleted) return
                        await message.reactions.removeAll()
                        await delay(20000)
                        if(!message.deleted) message.delete().catch()
                    }
                    return
                default:
                    var embed = new discord.MessageEmbed()
                        .setColor(color.lightblue)
                        .setAuthor('Linkerkennung | Erlaubte Links')
                        .setDescription(`\`${serverdata[msg.guild.id].prefix}settings automod links whitelist\`\n\n\`add <Link 1> [Link 2] [Link 3] ... [Link n]\`\nFüge neue Links zur Whitelist hinzu.\n\n\`remove <Link 1> [Link 2] [Link 3] ... [Link n]\`\nEntferne Links von der Whitelist.\n\n\`list\`\nZeige alle erlaubten Links an.`)
                        .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
                    message = await msg.channel.send(embed)
                    await delay(30000)
                    if(!message.deleted) message.delete().catch()
                    return
            }
        } else if(['role', 'roles', 'r'].includes(args[2].toLowerCase())) {
            if(!serverdata[guildid].amconfig.links) {
                serverdata[guildid].amconfig.links = {
                    on: true,
                    linkwl: [],
                    channelwl: [],
                    rolewl: []
                }
            }
            if(!args[3]) args[3] = ''
            switch(args[3].toLowerCase()) {
                case 'add':
                case 'a': 
                    if(!args[4]) return embeds.error(msg, 'Fehler', `Gib mindestens die ID einer Rolle an.\n\`${serverdata[guildid].prefix}settings automod links roles add <Role ID 1> [Role ID 2] [Role ID 3] ... [Role ID n]\``)
                    roles = args.slice(4)
                    roles = roles.filter(async role => {
                        if(isNaN(role)) return false
                        role = await msg.guild.roles.fetch(role).catch()
                        if(!role) return false
                        else return true
                    })
                    if(roles.length == 0) return embeds.error(msg, 'Fehler', 'Es wurden keine gültigen IDs angegeben.')
                    roles = roles.filter(role => {
                        if(serverdata[msg.guild.id].amconfig.links.rolewl.includes(role)) return false
                        else return true
                    })
                    roles.forEach(role => serverdata[guildid].amconfig.links.rolewl.push(role))
                    if(roles.length == 0) return embeds.error(msg, 'Fehler', 'Alle angegebenen Rollen sind können bereits Links senden.')
                    if(roles.length == 1) return embeds.success(msg, 'Rollenberechtigung hinzugefügt', `Alle Nutzer mit der <@&${roles}> Rolle können nun Link senden.`)
                    await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                    roles.forEach(role => {role = '<@&' + role +'>'})
                    embeds.success(msg, 'Rollenberechtigungen hinzugefügt', `Nutzer mit mindestens einer dieser Rollen können jetzt Links, die nicht auf der Whitelist stehen, senden: ${roles.join('\n')}`)
                    break
                case 'r':
                case 'remove':
                    if(!args[4]) return embeds.error(msg, 'Fehler', `Gib mindestens die ID einer Rolle an.\n\`${serverdata[guildid].prefix}settings automod links roles add <Role ID 1> [Role ID 2] [Role ID 3] ... [Role ID n]\``)
                    roles = args.slice(4)
                    roles = roles.filter(role => {if(serverdata[guildid].amconfig.links.rolewl.includes(role)) return true
                    else return false})
                    if(roles.length == 0) return embeds.error(msg, 'Fehler', 'Alle genannten Rollen haben keine Rechte zum Links senden oder sind ungültig.')
                    serverdata[guildid].amconfig.links.rolewl = serverdata[guildid].amconfig.links.rolewl.filter(role => {
                        if(roles.includes(role)) return false
                        else {
                            roles.splice(roles.indexOf(role), 1)
                            return true
                        }
                    })
                    if(roles.length == 0) return embeds.error(msg, 'Fehler', 'Alle genannten Rollen haben keine Berechtigung, Links zu senden.')
                    await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                    if(roles.length == 1) return embeds.success(msg, 'Rollenberechtigung entfernt', `Nutzer mit der <@&${roles[0]}> Rolle können nun keine Links mehr senden, außer sie haben eine andere Rolle, die ihnen das ermöglicht.`)
                    roles.forEach(role => {role = '<@&' + role +'>'})
                    return embeds.success(msg, 'Rollenberechtigungen entfernt', `Diese Rollen können nun keine Links mehr senden:\n${roles.join('\n')}`)
                case 'list':
                case 'l':
                    if(serverdata[guildid].amconfig.links.rolewl.length == 0) return embeds.error(msg, 'Rollenberechtigungen', 'Keine Rolle hat das Recht, nicht gewhitelitete Links zu senden.')
                    await msg.guild.roles.fetch()
                    var temp = false
                    serverdata[guildid].amconfig.links.rolewl = serverdata[guildid].amconfig.links.rolewl.filter(role => {
                        if(!msg.guild.roles.cache.has(role)) {
                            serverdata[guildid].amconfig.links.rolewl.splice(serverdata[guildid].amconfig.links.rolewl.indexOf(role))
                            temp = true
                            return false
                        } else return true
                    })
                    if(temp) await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                    delete temp
                    rolearray = serverdata[guildid].amconfig.links.rolewl.slice()
                    for (var index = 0; rolearray[index]; index ++) {
                        role = rolearray[index]
                        rolearray[index] = `<@&${role}>`
                    }
                    if(rolearray.length <= 10) {
                        var embed = new discord.MessageEmbed()
                            .setColor(color.lightblue)
                            .setTitle('Rollenberechtigungen')
                            .setDescription(`Dies ist eine Liste aller Rollen, denen es erlaubt ist, auch nicht gewhitelistete Links zu senden:\n${rolearray.join('\n')}`)
                            .setFooter(`KeksBot ${config.version}`)
                        var message = await msg.channel.send(embed)
                        await delay(20000)
                        if(!message.deleted) message.delete().catch()
                    } else {
                        const changePage = async (m, links, pageN, modifier) => {
                            if((pageN == 0 && modifier == 1) || (pageN == Math.floor((links.length - 1) / 10) && modifier == -1) || (0 < pageN < Math.floor((links.length - 1) / 10))) pageN = pageN + modifier
                            links = links.slice(pageN * 10, pageN * 10 +10)
                            var embed = new discord.MessageEmbed()
                                .setColor(color.lightblue)
                                .setTitle(`Rollenberechtigungen | Seite ${pageN + 1}`)
                                .setDescription(`Dies ist eine Liste aller Rollen, denen es erlaubt ist, auch nicht gewhitelistete Links zu senden:\n${links.join('\n')}`)
                                .setFooter(`KeksBot ${config.version} | Zeige Einträge ${pageN * 10 + 1} bis ${pageN * 10 + 10}`)
                            await m.edit(embed)
                            return pageN
                        }
                        let page = 0
                        var links = rolearray
                        var embed = new discord.MessageEmbed()
                            .setColor(color.lightblue)
                            .setTitle(`Rollenberechtigungen | Seite ${page + 1}`)
                            .setDescription(`Dies ist eine Liste aller Rollen, denen es erlaubt ist, auch nicht gewhitelistete Links zu senden:\n${links.join('\n')}`)
                            .setFooter(`KeksBot ${config.version} | Zeige Einträge ${page * 10 + 1} bis ${page * 10 + 10}`)
                        var message = await msg.channel.send(embed)
                        const filter = (reaction, user) => user.id === msg.author.id
                        links = rolearray
                        const collector = await message.createReactionCollector(filter, { time: 180000 })
                        collector.on('collect', async (r, u) => {
                            if(u.id === client.user.id) return
                            switch(r.emoji.name) {
                                case '◀': 
                                    page = await changePage(message, links, page, -1)
                                    r.users.remove(msg.author)
                                    break
                                case '▶':
                                    page = await changePage(message, links, page, 1)
                                    r.users.remove(msg.author)
                                    break
                                case '⏪':
                                    page = await changePage(message, links, 0, 0)
                                    r.users.remove(msg.author)
                                    break
                                case '⏩':
                                    page = await changePage(message, links, Math.floor((links.length - 1) / 10), 0)
                                    r.users.remove(msg.author)
                                    break
                                case '⏹': 
                                    await r.message.reactions.removeAll()
                                    await delay(30000)
                                    if(!message.deleted) message.delete().catch()
                                    break
                                default: 
                                    r.users.remove(msg.author)
                            }
                        })
                        await message.react('⏪')
                        await message.react('◀')
                        await message.react('⏹')
                        await message.react('▶')
                        await message.react('⏩')
                        await delay(180000)
                        if(message.deleted) return
                        await message.reactions.removeAll()
                        await delay(20000)
                        if(!message.deleted) message.delete().catch()
                    }
                    return
                default:
                    var embed = new discord.MessageEmbed()
                        .setColor(color.lightblue)
                        .setTitle('Linkerkennung | Rollen')
                        .setDescription(`\`${serverdata[guildid].prefix}settings automod links roles\`\n\n\`add <Role ID 1> [Role ID 2] [Role ID 3] ... [Role ID n]\`\nErlaube Nutzern mit einer bestimmten Rolle, nicht gewhitelistete Commands zu verwenden.\n\`remove <Role ID 1> [Role ID 2] [Role ID 3] ... [Role ID n]\`\nEntziehe einer Rolle die Berechtigung, nicht gewhitelistete Links zu senden.\n\`list\`\nZeige alle Rollen, die Links senden können, an.`)
                        .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
                    var message = await msg.channel.send(embed)
                    await delay(30000)
                    if(!message.deleted) message.delete().catch()
            }
        } else if(['channel', 'channels', 'c'].includes(args[2].toLowerCase())) {
            if(!serverdata[guildid].amconfig.links) {
                serverdata[guildid].amconfig.links = {
                    on: true,
                    linkwl: [],
                    channelwl: [],
                    rolewl: []
                }
            }
            if(!args[3]) args[3] = ''
            
            switch(args[3].toLowerCase()) {
                case 'add':
                case 'a':
                    
            }

        } else {
            var embed = new discord.MessageEmbed()
                .setColor(color.lightblue)
                .setTitle('Linkerkennung')
                .setDescription(`\`${serverdata[msg.guild.id].prefix}settings automod links\`\n\n\`<on || off>\`\nSchalte sie Linkerkennung ein oder aus.\n\`whitelist\`\nBearbeite die Liste der erlaubten Links. Diese können immer von jedem Nutzer gesendet werden.\n\`roles\`\nErlaube bestimmten Rollen, auch andere Links zu senden.\n\nModeratoren können immer alle Links senden.`)
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