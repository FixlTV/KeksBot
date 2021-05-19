const embeds = require('../../embeds')
const discord = require('discord.js')
const linkify = require('linkifyjs')
const fs = require('fs').promises

module.exports = async (msg, args, guildid, serverdata, client, color) => {
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
}