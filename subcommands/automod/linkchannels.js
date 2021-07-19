const embeds = require('../../embeds')
const discord = require('discord.js')
const fs = require('fs').promises
const config = require('../../config.json')
const delay = require('delay')

module.exports = async (msg, args, guildid, serverdata, client, color) => {
    switch(args[3].toLowerCase()) {
        case 'add':
        case 'a':
            if(!args[4]) return embeds.error(msg, 'Fehler', `Gib mindestens einen Kanal oder eine Channel ID an.\n\`${serverdata[guildid].prefix}settings automod links channels add <Channel ID 1> [Channel ID 2] [Channel ID 3] ... [Channel ID n]\``)
            var channels = []
            if(msg.mentions.channels && msg.mentions.channels.first()) msg.mentions.channels.filter(c => c.type === 'text').array().forEach(c => channels.push(c.id))
            await msg.guild.channels.fetch()
            args.slice(4).forEach(id => {
                if(msg.guild.channels.filter(c => c.type === 'text').has(id)) channels.push(id)
            })
            if(channels.length == 0) return embeds.error(msg, 'Fehler', `Gib mindestens einen Textkanal an.\n\`${serverdata[msg.guild.id].prefix}settings automod links channels add <Kanal 1> [Kanal 2] [Kanal 3] ... [Kanal n]\``)
            channels.filter(c => {
                if(serverdata[msg.guild.id].amconfig.links.channelwl.includes(c)) return false
                else return true
            })
            if(channels.length == 0) return embeds.error(msg, 'Fehler', 'Alle angegebenen Kanäle sind bereits von der Linkerkennung ausgeschlossen.')
            channels.forEach(c => serverdata[guildid].amconfig.links.channels.channelwl.push(c))
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            if(channels.length == 1) return embeds.success(msg, 'Kanal hinzugefügt', `In <#${roles[0]}> können nun Links gesendet werden.`)
            channels.forEach(c => {c = `<#${c}>`})
            embeds.success(msg, 'Kanäle hinzugefügt', `In diese Kanälen können nun Links gesendet werden:\n${c.join(',\n')}`)
            break
        case 'r':
        case 'remove':
            if(!args[4]) return embeds.error(msg, 'Fehler', `Gib mindestens einen Kanal oder eine Channel ID an.\n\`${serverdata[guildid].prefix}settings automod links channels add <Channel ID 1> [Channel ID 2] [Channel ID 3] ... [Channel ID n]\``)
            var channels = []
            if(msg.mentions.channels && msg.mentions.channels.first()) msg.mentions.channels.filter(c => c.type === 'text').array().forEach(c => channels.push(c.id))
            await msg.guild.channels.fetch()
            args.slice(4).forEach(id => {
                if(msg.guild.channels.filter(c => c.type === 'text').has(id)) channels.push(id)
            })
            if(channels.length == 0) return embeds.error(msg, 'Fehler', `Gib mindestens einen Textkanal an.\n\`${serverdata[msg.guild.id].prefix}settings automod links channels add <Kanal 1> [Kanal 2] [Kanal 3] ... [Kanal n]\``)
            channels = channels.filter(role => {
                if(serverdata[guildid].amconfig.links.channelwl.includes(role)) return true
                else return false
            })
            if(channels.length == 0) return embeds.error(msg, 'Fehler', 'In allen angegebenen Kanälen kann man keine Links senden')
            serverdata[guildid].amconfig.links.channelwl = serverdata[guildid].amconfig.links.channelwl.filter(role => {
                if(channels.includes(role)) return false
                else {
                    channels.splice(roles.indexOf(role), 1)
                    return true
                }
            })
            if(channels.length == 0) return embeds.error(msg, 'Fehler', 'In allen angegebenen Kanälen kann man keine Links senden')
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            if(channels.length == 1) return embeds.success(msg, 'Kanalüberschreibung entfernt', `In <#${channels[0]}> können keine Links mehr gesendet werden.`)
            channels.forEach(role => {role = '<#' + role +'>'})
            return embeds.success(msg, 'Kanalüberschreibungen entfernt', `In diese Kanäle können keine Links mehr gesendet werden:\n${roles.join(',\n')}`)
        case 'l':
        case 'list':
            if(serverdata[guildid].amconfig.links.channelwl.length == 0) return embeds.error(msg, 'Keine Kanäle', 'Es gibt keine Kanäle, in die Links (außer gewhitelistete) gesendet werden können.')
            await msg.guild.roles.fetch()
            var temp = false
            serverdata[guildid].amconfig.links.channelwl = serverdata[guildid].amconfig.links.channelwl.filter(role => {
                if(!msg.guild.roles.cache.has(role)) {
                    serverdata[guildid].amconfig.links.channelwl.splice(serverdata[guildid].amconfig.links.channelwl.indexOf(role))
                    temp = true
                    return false
                } else return true
            })
            if(temp) await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            delete temp
            rolearray = serverdata[guildid].amconfig.links.channelwl.slice()
            for (var index = 0; rolearray[index]; index ++) {
                role = rolearray[index]
                rolearray[index] = `<#${role}>`
            }
            if(rolearray.length <= 10) {
                var embed = new discord.MessageEmbed()
                    .setColor(color.lightblue)
                    .setTitle('Kanalüberschreibungen')
                    .setDescription(`Dies ist eine Liste aller Kanäle, in denen (alle) Links erlaubt sind:\n${rolearray.join(',\n')}`)
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
                        .setTitle(`Kanalüberschreibungen | Seite ${pageN + 1}`)
                        .setDescription(`Dies ist eine Liste aller Kanäle, in denen (alle) Links erlaubt sind:\n${links.join(',\n')}`)
                        .setFooter(`KeksBot ${config.version} | Zeige Einträge ${pageN * 10 + 1} bis ${pageN * 10 + 10}`)
                    await m.edit(embed)
                    return pageN
                }
                let page = 0
                var links = rolearray
                var embed = new discord.MessageEmbed()
                    .setColor(color.lightblue)
                    .setTitle(`Kanalüberschreibungen | Seite ${pageN + 1}`)
                    .setDescription(`Dies ist eine Liste aller Kanäle, in denen (alle) Links erlaubt sind:\n${links.join(',\n')}`)
                    .setFooter(`KeksBot ${config.version} | Zeige Einträge ${pageN * 10 + 1} bis ${pageN * 10 + 10}`)
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
                .setTitle('Linkerkennung | Kanäle')
                .setDescription(`\`${serverdata[guildid].prefix}settings automod links channels\`\n\n\`add <Kanal 1> [Kanal 2] [Kanal 3] ... [Kanal n]\`\nErlaube allen Nutzern in einem Kanal, nicht gewhitelistete Commands zu verwenden.\n\`remove <Kanal 1> [Kanal 2] [Kanal 3] ... [Kanal n]\`\nEntziehe den Mitgliedern die Berechtigung, nicht gewhitelistete Links in bestimmte Kanäle zu senden.\n\`list\`\nZeige alle Kanäle, in die Links gesendet werden können, an.`)
                .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            var message = await msg.channel.send(embed)
            await delay(30000)
            if(!message.deleted) message.delete().catch()
    }
}