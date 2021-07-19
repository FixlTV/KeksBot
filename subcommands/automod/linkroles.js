const embeds = require('../../embeds')
const discord = require('discord.js')
const fs = require('fs').promises
const config = require('../../config.json')
const delay = require('delay')

module.exports = async (msg, args, guildid, serverdata, client, color) => {
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
            if(roles.length == 0) return embeds.error(msg, 'Fehler', 'Alle angegebenen Rollen sind können bereits Links senden.')
            roles.forEach(role => serverdata[guildid].amconfig.links.rolewl.push(role))
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            if(roles.length == 1) return embeds.success(msg, 'Rollenberechtigung hinzugefügt', `Alle Nutzer mit der <@&${roles}> Rolle können nun Link senden.`)
            roles.forEach(role => {role = '<@&' + role +'>'})
            embeds.success(msg, 'Rollenberechtigungen hinzugefügt', `Nutzer mit mindestens einer dieser Rollen können jetzt Links, die nicht auf der Whitelist stehen, senden: ${roles.join(',\n')}`)
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
}