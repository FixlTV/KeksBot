const discord = require('discord.js')
const delay = require('delay')
const fs = require('fs').promises
const embeds = require('../embeds')
const linkify = require('linkifyjs')

const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}

module.exports = async (msg, args, client, serverdata) => {
    if(!args[1]) args[1] = ''
    if(!serverdata[msg.guild.id].amconfig) serverdata[msg.guild.id].amconfig = {}
    if(['on', 'an', 'ein'].includes(args[1].toLowerCase())) { //Automod aktivieren
        if(serverdata[msg.guild.id].automod) return embeds.error(msg, 'Fehler', 'Der AutoMod ist bereits aktiv.')
        serverdata[msg.guild.id].automod = true
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        return embeds.success(msg, 'AutoMod aktiviert', 'Der AutoMod ist nun aktiv. Verwende `' + serverdata[msg.guild.id].prefix + 'settings automod`, um die einzelnen Systeme anzupassen.')
    } else if(['off', 'aus'].includes(args[1].toLowerCase())) { //Automod deaktivieren
        if(!serverdata[msg.guild.id].automod) return embeds.error(msg, 'Fehler', 'Der AutoMod ist bereits deaktiviert.')
        delete serverdata[msg.guild.id].automod
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        return embeds.success(msg, 'AutoMod deaktiviert', 'Der AutoMod ist jetzt aus. Deine Einstellungen wurden jedoch gespeichert.')
    } else if(['links', 'link'].includes(args[1].toLowerCase())) {//Linkdetection
        if(!args[2]) args[2] = ''
        if(['on', 'an', 'ein'].includes(args[2].toLowerCase())) {
            if(serverdata[msg.guild.id].amconfig.links && serverdata[msg.guild.id].amconfig.links.on) return embeds.error(msg, 'Fehler', 'Die Linkerkennung ist bereits aktiv')
            if(!serverdata[msg.guild.id].amconfig.links) {
                serverdata[msg.guild.id].amconfig.links = {
                    on: true,
                    linkwl: [],
                    channelwl: [],
                    rolewl: []
                }
            } else serverdata[msg.guild.id].amconfig.links.on = true
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return embeds.success(msg, 'Linkerkennung aktivert', `Links werden nun automatisch gelöscht.\nVerwende \`${serverdata[msg.guild.id].prefix}settings automod links\`, um das System anzupassen.\n**Achtung**: Die Linkerkennung löscht keine Discord Invites. Aktiviere bitte hierfür das Invite Modul (\`${serverdata[msg.guild.id].prefix}settings automod invite\`)`)
        } else if(['off', 'aus'].includes(args[2].toLowerCase())) {
            if(!serverdata[msg.guild.id].amconfig.links) return embeds.error(msg, 'Fehler', 'Die Linkerkennung ist nicht aktiv.')
            serverdata[msg.guild.id].amconfig.links.on = false
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return embeds.success(msg, 'Linkerkennung deaktiviert', 'Links werden nun nicht mehr gelöscht. Die Einstellungen wurden beibehalten.')
        } else if(['whitelist', 'wl'].includes(args[2])) {
            if(!args[3]) args[3] = ''
            switch(args[3].toLowerCase()) {
                case 'a':
                case 'add': 
                    if(!args[4]) return embeds.error(msg, 'Syntaxfehler', `\`${serverdata[msg.guild.id].prefix}settings links whitelist add <Link> [Link...]\`\nBitte gib mindestens einen Link an.`)
                    var links = args.slice(4)
                    var linkjson = linkify.find(links.join(' '), 'url')
                    linkjson.forEach(url => {
                        links.forEach(link => {
                            if(url.href.includes(link)) links[links.indexOf(link)] = url.href
                        })
                    })
                    links.forEach(link => {
                        var index = links.indexOf(link)
                        link = link.href.split('/').slice(0, 3).join('/').replace('www.','').split('//')
                        link[0] = link[0].replace('https', 'http')
                        link = link.join('//')
                        if(!serverdata[msg.guild.id].amconfig.links.linkwl.includes(link)) {
                            serverdata[msg.guild.id].amconfig.links.linkwl.push(link)
                            links[index] = link
                        } else {
                            links.splice(index, 1)
                        }
                    })
                    await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                    if(links.length == 0) return embeds.error(msg, 'Keine Links hinzugefügt', 'Alle angegebenen Links sind bereits erlaubt.')
                    return embeds.success(msg, 'Links hinzugefügt', `Folgende Links sind nun auf der Whitelist:\n${links}`)
                case 'r':
                case 'remove':
                    if(!args[4]) return embeds.error(msg, 'Syntaxfehler', `\`${serverdata[msg.guild.id].prefix}settings links whitelist remove <Link> [Link...]\`\nBitte gib mindestens einen Link an.`)
                    var links = args.slice(4)
                    var linkjson = linkify.find(links.join(' '), 'url')
                    linkjson.forEach(url => {
                        links.forEach(link => {
                            if(url.href.includes(link)) links[links.indexOf(link)] = url.href
                        })
                    })
                    var temp = []
                    links.forEach(link => {
                        var index = links.indexOf(link)
                        link = link.href.split('/').slice(0, 3).join('/').replace('www.','').split('//')
                        link[0] = link[0].replace('https', 'http')
                        link = link.join('//')
                        if(serverdata[msg.guild.id].amconfig.links.linkwl.includes(link)) {
                            serverdata[msg.guild.id].amconfig.links.linkwl.splice(index, 1)
                            links.splice(index, 1)
                            temp.push(link)
                        }
                    })
                    await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                    if(links.length == 0) return embeds.error(msg, 'Keine Links entfernt', 'Alle angegebenen Links sind bereits verboten.')
                    return embeds.success(msg, 'Links entfernt', `Folgende Links sind nun nicht mehr auf der Whitelist:\n${temp}`)
                case 'l':
                case 'list':
                    if(serverdata[msg.guild.id].amconfig.links.linkwl.length <= 10) {
                        var embed = new discord.MessageEmbed()
                            .setColor(color.lightblue)
                            .setTitle('Link Whitelist')
                            .setDescription(`Dies ist eine Liste aller erlaubten Links:\n${serverdata[msg.guild.id].amconfig.links.linkwl}`)
                            .setFooter(`KeksBot ${config.version}`)
                        var message = await msg.channel.send(embed)
                        await delay(20000)
                        if(!message.deleted) message.delete().catch()
                    } else {
                        const changePage = (page, modifier, links) => {
                            if(page > 0 && page < Math.floor((links.length - 1) / 10)) page = page + modifier
                        }
                        var page = 0
                        var links = serverdata[msg.guild.id].amconfig.links.linkwl.slice(page * 10, page * 10 + 10)
                        var embed = new discord.MessageEmbed()
                            .setColor(color.lightblue)
                            .setTitle(`Link Whitelist | Seite ${page + 1}`)
                            .setDescription(`Dies ist eine Liste aller erlaubten Links:\n`)
                    }
                    
                    
                    
                    return
                default: 
                    var embed = new discord.MessageEmbed()
            }
        }
    } else { //Startseite
        var embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle('AutoMod')
            .setDescription('Hier ist der aktuelle AutoMod Status:')
            .setFooter(`KeksBot ${config.version}`)
        if(!serverdata[msg.guild.id].automod) {
            embed.addField('AutoMod', `**Inaktiv**\nBenutze \`${serverdata[msg.guild.id].prefix}settings automod on\`, um ihn zu aktivieren.`)
        } else {
            embed.addField('AutoMod', `**Aktiv**\nVerwende \`${serverdata[msg.guild.id].prefix}settings automod off\`, um ihn zu deaktivieren`)
            if(serverdata[msg.guild.id].amconfig.links.on) embed.addField('Linkentfernung', `**Aktiv**\nVerwende \`${serverdata[msg.guild.id].prefix}settings automod links\`, um die Erkennung von Links zu deaktivieren oder anzupassen.`)
            else embed.addField('Linkentfernung', `**Inaktiv**\nVerwende \`${serverdata[msg.guild.id].prefix}settings automod links on\`, um sie zu aktivieren`)
        }
        var message = await msg.channel.send(embed)
        await delay(30000)
        if(!message.deleted) message.delete().catch()
        return
    }
}