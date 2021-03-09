const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')
const bild = 'https://cdn.discordapp.com/attachments/780008420785782784/782596008466186240/partnerserver.png'
const delay = require('delay')

const applicationcancel = async (msg, temp, embed, color, emotes) => {
    if(temp == 1) {
        return
    } else {
        embed.setColor(color.red)
        embed.addField('Anfrage abgebrochen', 'Zeitüberschreitung der Verbindung\nDu hast keine Eingabe gegeben.')
        msg.reactions.removeAll()
        var message = await msg.edit(embed)       
        await delay(40000)
        if(!message.deleted) message.delete()
    }
}

module.exports = {
    commands: 'partner',
    description: 'Partnerinformationen und Bewerbungen',
    expectedArgs: '[apply || cancel || info]',
    type: 'info',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        var g = msg.guild
        var gid = g.id
        msg.delete()
        if(args[0] == 'apply') {
            let temp = 0
            if(msg.member.hasPermission('ADMINISTRATOR')) {
                if(serverdata[gid].lv == 6) {
                    if(g.members.cache.filter(member => !member.user.bot).size >= config.mPartnerNeed) {
                        let timeout = 0
                        var embed = new discord.MessageEmbed()
                            .setColor(color.normal)
                            .setTitle(`${emotes.partnerlogo} KeksBot Partnerschaft`)
                            .setDescription('Du bist gerade dabei, eine Partnerschaft mit dem KeksBot zu beantragen.\nBitte beachte, dass durch die Anfrage eine Einladung zum Server an das KeksBot Team geschickt wird.\nWir überprüfen stichprobenartig die Server, um eine Partnerschaft mit einem Server, der gegen unsere Richtlinien, die Discord ToS oder die Gesetze der Bundesrepublik Deutschland widerspricht, zu verhindern.\nSollten wir trotzdem herausfinden, dass ein Partnerserver dies tut, werden wir die Partnerschaft unverzüglich beenden, den Besitzer sowie den Server von der Botnutzung ausschließen und den Server, sofern notwendig (bei Verletzung der ToS beziehungsweise Gesetze), dem Trust ans Safety Team von Discord melden. Auch eine strafrechtliche Verfolgung können wir nicht ausschließen.\n\nWenn du die Anfrage absenden willst, lies die oben genannten Aspekte bitte sorgfältig durch und reagiere unter dieser Nachricht.')
                            .setThumbnail(bild)
                            .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                        msg.channel.send(embed).then(message => {
                            message.react('775004072465399848').then(r => {
                                message.react('775004095056052225')
                                const acceptFilter = (reaction, user) => reaction.emoji.id === '775004072465399848' && user.id === msg.author.id
                                const deniedFilter = (reaction, user) => reaction.emoji.id === '775004095056052225' && user.id === msg.author.id

                                const accept = message.createReactionCollector(acceptFilter, { timer: 20000 })
                                const denied = message.createReactionCollector(deniedFilter, { timer: 20000 })

                                timeout = setTimeout(applicationcancel, 20000, message, temp, embed, color)

                                accept.on('collect', r => {
                                    if(temp == 1) return
                                    clearTimeout(timeout)
                                    temp = 1
                                    message.reactions.removeAll()
                                    embed.setColor(color.yellow)
                                    embed.setTitle(`${emotes.pinging} Die Anfrage wird bearbeitet...`)
                                    embed.setDescription('Eure Bewerbung wird gerade initialisiert.\nSollte der Vorgang nach einer Minute noch nicht beendet sein, wendet euch bitte an ein KeksBot Teammitglied.')
                                    embed.addField('Status', 'Aktualisiere Daten...')
                                    message.edit(embed).then(message => {
                                        serverdata[gid].lv = 7
                                        fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                                        embed.spliceFields(0, 1, [{
                                            name: 'Status',
                                            value: 'Suche Informations-Kanal...'
                                        }])
                                        message.edit(embed).then(message => {
                                            client.channels.fetch('782158455771365396').then(channel => {
                                                embed.spliceFields(0, 1, [{
                                                    name: 'Status',
                                                    value: 'Erstelle Einladung...'
                                                }])
                                                message.edit(embed).then(message => {
                                                        msg.channel.createInvite({ maxAge: 0, unique: true, reason: `KeksBot Partnerschaft: ${msg.author.tag} hat eine Partnerschaftsanfrage ausgestellt.`}).then(invite => {
                                                        embed.spliceFields(0, 1, [{
                                                            name: 'Status',
                                                            value: 'Übermittle Daten...'
                                                        }])
                                                        message.edit(embed).then(message => {
                                                            var embedx = new discord.MessageEmbed()
                                                                .setColor(color.normal)
                                                                .setTitle(`${g.name} | ${gid}`)
                                                                .setThumbnail(g.iconURL({ dynamic: true }))
                                                                .setDescription(`Partnerschaftsanfrage ausgestellt von ${msg.author}`)
                                                                .addField('Mitglieder', g.memberCount, true)
                                                                .addField('Davon Nutzer', g.members.cache.filter(member => !member.user.bot).size, true)
                                                                .addField('Davon Bots', g.members.cache.filter(member => member.user.bot).size, true)
                                                                .addField('Owner', g.owner, true)
                                                                .addField('Einladung', `[${invite.code}](${invite.url})`, true)
                                                                .setTimestamp()
                                                                .addField('Erfahrungspunkte', serverdata[gid].xp, true)
                                                                .setFooter('KeksBot Partner', client.user.avatarURL())
                                                            channel.send(embedx).then(msgx => {
                                                            embed.setColor(color.lime)
                                                            embed.setTitle(`${emotes.accept} Anfrage abgeschickt`)
                                                            embed.setDescription('Herzlichen Glückwunsch!\nEure Bewerbung wurde erfolgreich abgeschickt.\nStellt bitte sicher, dass ihr einen Kanal für Systembenachrichtigungen oder einen für Community Updates habt, damit wir euch bei Updates zu eurer Partnerschaft informieren können. Ansonsten werden diese Informationen in einen zufällig ausgewählten Kanal gesendet.')
                                                            embed.spliceFields(0, 1)
                                                            message.edit(embed).then(msg =>         
                                                                setTimeout(msg => {
                                                                    if(!msg.deleted) {msg.delete()}
                                                                }, 40000, msg)
                                                            )
                                                            })    
                                                        })    
                                                    })    
                                                })
                                            })
                                        })
                                    })
                                })
                                denied.on('collect', r => {
                                    if(temp == 1) return
                                    clearTimeout(timeout)
                                    temp = 1
                                    embed.setColor(color.red)
                                    embed.spliceFields(0, embed.fields.length)
                                    embed.addField('Abgebrochen', 'Die Anfrage wurde erfolgreich abgebrochen.')
                                    message.reactions.removeAll()
                                    message.edit(embed).then(msg =>         
                                        setTimeout(msg => {
                                            if(!msg.deleted) {msg.delete()}
                                        }, 10000, msg)
                                    )
                                })
                            })
                        })
                    } else {
                        embeds.error(msg, 'Nicht genügend Mitglieder', `Ihr habt aktuell zu wenig Mitglieder.\nUm Patner zu werden braucht ihr noch ${config.mPartnerNeed - g.members.cache.filter(member => !member.user.bot).size}`)
                    }
                } else {
                    if(serverdata[gid].lv < 6) {
                        embeds.error(msg, 'Level zu niedrig', `Um eine Partnerschaft zu beantragen, braucht der Server mindestens ${config.Partner} Erfahrungspunkte.\nIhr habt aktuell nur ${serverdata[gid].xp} EP.`)
                    } else if(serverdata[gid].lv == 7) {
                        embeds.error(msg, 'Bereits beworben', 'Eure Anfrage steht noch aus.')
                    } else if(serverdata[gid].lv == 8) {
                        embeds.error(msg, '._.', 'Ihr seid schon Partner. Ihr könnt euch daher nicht nochmal bewerben.')
                    } else {
                        embeds.error(msg, 'Fehler', 'Ein Fehler ist aufgetreten.')
                    }
                }
            } else embeds.needperms(msg, 'ADMINISTRATOR')
        } else if(args[0] == 'cancel') {
            if(msg.member.hasPermission('ADMINISTRATOR')) {
                if(serverdata[gid].lv == 7) {
                    var embed = new discord.MessageEmbed()
                        .setColor(color.yellow)
                        .setTitle(`${emotes.pinging} Anfrage wird zurückgezogen...`)
                        .setDescription('Dies kann einige Zeit dauern...')
                    msg.channel.send(embed).then(message => {
                        serverdata[gid].lv = 6
                        fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                        embed.setColor(color.lime)
                        embed.setTitle(`${emotes.accept} Partnerschaftsanfage zurückgezogen.`)
                        embed.setDescription('Euer Antrag wurde erfolgreich zurückgezogen.')
                        message.edit(embed).then(msg =>         
                            setTimeout(msg => {
                                if(!msg.deleted) {msg.delete()}
                            }, 10000, msg)
                        )
                    })
                } else {
                    embeds.error(msg, 'Fehler', 'Ihr habt keine ausstehende Partnerschaftsanfrage.')
                }
            } else {
                embeds.needperms(msg, 'ADMINISTRATOR')
            }
        } else if(args[0] == 'accept') {
            if(config.mods.includes(msg.author.id)) {
                if(args[1]) {
                    if(!isNaN(args[1])) {
                        gid = args[1]
                        if(serverdata[gid]) {
                            if(serverdata[gid].lv == 7) {
                                var embed = new discord.MessageEmbed()
                                    .setColor(color.yellow)
                                    .setTitle(`${emotes.pinging} Verpartnerung läuft...`)
                                    .setDescription('Alle Daten werden angelegt...')
                                    msg.channel.send(embed).then(message => {
                                        client.guilds.fetch(gid).then(guild => {
                                            var ownerID = guild.ownerID
                                            if(userdata[ownerID]) {
                                            } else {
                                                userdata[ownerID] = {}
                                            }
                                            if(userdata[ownerID].partner) {
                                            } else {
                                                userdata[ownerID].partner = 0
                                            }
                                            userdata[ownerID].partner ++
                                            serverdata[gid].lv = 8
                                            serverdata[gid].partner = 1
                                            fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                                            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
                                            embed.setDescription('Benachrichtige Server...')
                                            message.edit(embed).then(message => {
                                                var embedx = new discord.MessageEmbed()
                                                    .setColor(color.normal)
                                                    .setTitle(`${emotes.partnerserver} KeksBot Partnerschaft`)
                                                    .setDescription('Euer Partnerschaftsantrag wurde soeben angenommen.\nHerzlichen Glückwunsch!')
                                                    .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                                                if(guild.systemChannel) {
                                                    var channelx = guild.systemChannel
                                                } else if(guild.publicUpdatesChannel) {
                                                    var channelx = guild.publicUpdatesChannel
                                                } else {
                                                    var channelx = guild.channels.cache.filter(channel => channel.type === 'text').first()
                                                }
                                                channelx.send(embedx).then(m => {
                                                    embed.setDescription('Publiziere in <#782307664528277536>...')
                                                    message.edit(embed).then(message => {
                                                        var embedy = new discord.MessageEmbed()
                                                            .setColor(color.normal)
                                                            .setTitle(`Neuer Partner: ${guild.name}`)
                                                            .setThumbnail(guild.iconURL({dynamic: true}))
                                                            .setDescription(`Der Server **${guild.name}** von <@${guild.ownerID}> ist nun Partner! Herzlichen Glückwunsch!`)
                                                            .addField('Serverinfos', `Mitglieder: ${guild.memberCount}\nDavon Nutzer: ${g.members.cache.filter(member => !member.user.bot).size}\nDavon Bots: ${g.members.cache.filter(member => member.user.bot).size}\nErfahrungspunkte: ${serverdata[gid].xp}\nID: ${g.id}`)
                                                            .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                                                        client.channels.fetch('782307664528277536').then(channely => {
                                                            channely.send(embedy).then(async m => {
                                                                embed.setDescription('Vergebe Rolle...')
                                                                await message.edit(embed)
                                                                let kekssupport = await client.guilds.fetch('775001585541185546')
                                                                if(kekssupport.members.cache.has(ownerID)) {
                                                                    var member = guild.owner
                                                                    member = kekssupport.member(member.user)
                                                                    let role = await kekssupport.roles.fetch('782630956619268106')
                                                                    if(!member.roles.cache.has(role)) {
                                                                        member.roles.add(role)
                                                                    }
                                                                }
                                                                embed.setDescription(`${guild.name} ist nun ein Partner!`)
                                                                embed.setColor(color.lime)
                                                                embed.setTitle(`${emotes.accept} Prozess abgeschlossen.`)
                                                                message.edit(embed)
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })

                            } else {
                                embeds.error(msg, 'Fehler', 'Deiser Server hat sich nicht beworben.')
                            }
                        } else {
                            embeds.error(msg, 'Fehler', 'Diesen Server gibt es nicht.')
                        }
                    } else {
                        embeds.error(msg, 'Syntaxfehler', 'Bitte gib eine Server ID an\n`partner accept <ID>`')
                    }
                } else {
                    embeds.error(msg, 'Syntaxfehler', 'Bitte gib eine Server ID an\n`partner accept <ID>`')
                }
            } else {
                embeds.needperms(msg, 'BOT-MODERATOR')
            }
        } else if(args[0] == 'reject') {
            if(config.mods.includes(msg.author.id)) {
                if(args[1]) {
                    if(!isNaN(args[1])) {
                        if(serverdata[args[1]]) {
                            if(serverdata[args[1]].lv == 7) {
                                var embed = new discord.MessageEmbed()
                                    .setColor(color.yellow)
                                    .setTitle(`${emotes.pinging} Antrag wird abgelehnt...`)
                                    .setDescription('Lade Begründung...')
                                msg.channel.send(embed).then(async message => {
                                    reason = [...args]
                                    reason.shift()
                                    reason.shift()
                                    if(reason.length == 0) {
                                        reason.unshift('Keine')
                                    }
                                    embed.addField('Begründung', reason.join(' '))
                                    embed.setDescription('Schreibe Daten...')
                                    await message.edit(embed)
                                    try {
                                            guild = await client.guilds.cache.get(args[1])
                                            if(!guild || !serverdata[guild.id]) {
                                                message.delete()
                                                embeds.error(msg, 'Fehler', 'Für diesen Server gibt es keine Daten ._.')
                                                return
                                            }
                                            serverdata[guild.id].lv = 6
                                            fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                                    } catch (err) {
                                        message.delete()
                                        embeds.error(msg, 'Fehler', 'Ich konnte den Server nicht finden.')
                                        return
                                    }
                                    embed.setDescription('Benachrichtige Server...')
                                    await message.edit(embed)
                                    if(guild.systemChannel) {
                                        var channelx = guild.systemChannel
                                    } else if(guild.publicUpdatesChannel) {
                                        var channelx = guild.publicUpdatesChannel
                                    } else {
                                        var channelx = guild.channels.cache.filter(channel => channel.type === 'text').first()
                                    }
                                    var embedx = new discord.MessageEmbed()
                                        .setColor(color.red)
                                        .setTitle(`${emotes.cookie} KeksBot Partner`)
                                        .setDescription(`**Antrag abgelehnt!**\nEuer Antrag wurde von \`${msg.author.username}\` abgelehnt.`)
                                        .addField('Begründung', reason.join(' '))
                                    channelx.send(embedx)
                                    embed.setColor(color.lime)
                                    embed.setTitle('Antrag abgelehnt')
                                    embed.setDescription(`Der Antrag von ${guild.name} wurde erfolgreich abgelehnt.`)
                                    await message.edit(embed)      
                                    setTimeout(msg => {
                                        if(!msg.deleted) {msg.delete()}
                                    }, 10000, message)
                                    return
                                })
                            } else {
                                embeds.error(msg, '404', 'Application not found.')
                            }
                        } else {
                            embeds.error(msg, '404', 'Server not found.')
                        }
                    } else {
                        embeds.error(msg, '.___.', 'Das ist keine ID.')
                    }
                } else {
                    embeds.syntaxerror(msg, 'parter reject <Server ID>')
                }
            } else {
                embed.needperms(msg, 'BOT-MODERATOR')
            }
        } else if(args[0] == 'revoke') {
            if(config.mods.includes(msg.author.id)) {
                if(!isNaN(args[1])) {
                    var id = args[1]
                    var embed = new discord.MessageEmbed()
                        .setColor(color.yellow)
                        .setTitle(`${emotes.pinging} Künige Partnerschaft...`)
                        .setDescription('Die Daten für die Kündigung werden geladen...\nDies kann einige Zeit dauern...')
                    msg.channel.send(embed).then(async message => {
                        if(client.guilds.cache.has(id)) {
                            var guild = await client.guilds.fetch(id)
                            embed.setDescription('Lade Begründung...')
                            await message.edit(embed)
                            var reason = [...args]
                            reason.shift()
                            reason.shift()
                            if(reason.length == 0) {
                                reason.push('Keine')
                            }
                            embed.addField('Begründung', reason.join(' '))
                            embed.setDescription('Überschreibe Daten...')
                            await message.edit(embed)
                            serverdata[id].lv = 6
                            delete serverdata[id].partner
                            if(userdata[guild.ownerID].partner == 1) {
                                delete userdata[guild.ownerID].partner
                            } else if(userdata[guild.ownerID].partner > 1) {
                                userdata[guild.ownerID].partner --
                            }
                            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
                            fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                            embed.setDescription('Benachrichtige Server...')
                            await message.edit(embed)
                            if(guild.systemChannel) {
                                var channelx = guild.systemChannel
                            } else if(guild.publicUpdatesChannel) {
                                var channelx = guild.publicUpdatesChannel
                            } else {
                                var channelx = guild.channels.cache.filter(channel => channel.type === 'text').first()
                            }
                            var embedx = new discord.MessageEmbed()
                                .setColor(color.red)
                                .setTitle(`${emotes.partnerlogo} Partnerschaft annuliert`)
                                .setDescription(`Eure KeksBot Partnerschaft wurde von \`${msg.author.username}\` aufgehoben.\nAlle Vorteile verlieren mit sofortiger Wirkung ihre Gültigkeit.`)
                                .addField('Begründung', reason.join(' '))
                            await channelx.send(embedx)
                            embed.setDescription('Entferne Rolle...')
                            await message.edit(embed)
                            let kekssupport = await client.guilds.fetch('775001585541185546')
                            if(kekssupport.members.cache.has(guild.ownerID) && !userdata[guild.ownerID].partner) {
                                var member = guild.owner
                                member = kekssupport.member(member.user)
                                let role = await kekssupport.roles.fetch('782630956619268106')
                                if(!member.roles.cache.has(role)) {
                                    member.roles.remove(role)
                                }
                            }
                            embed.setColor(color.lime)
                            embed.setTitle('Partnerschaft aufgelöst')
                            embed.setDescription(`Die Partnerschaft mit ${guild.name} wurde erfolgreich annuliert.`)
                            message.edit(embed)
                        } else {
                            embed.setColor(color.red)
                            embed.setTitle('404')
                            embed.setDescription('Der Server wurde nicht gefunden.\nDie Kündigung wird abgebrochen.')
                            message.edit(embed).then(msg =>         
                                setTimeout(msg => {
                                    if(!msg.deleted) {msg.delete()}
                                }, 10000, msg).then(() => {return})
                            )
                        }
                    })
                } else {
                    embeds.error(msg, '.___.', 'Deine \'ID\' ist gar keine ID. Es ist nicht mal ne Zahl.\nIch will aber ne ID.')
                }
            } else {
                embeds.needperms(msg, 'BOT-MODERATOR')
                return
            }
        } else if((args[0] == 'info') ||(args[0] == 'help')) {
                if(msg.guild.members.cache.filter(m => !m.user.bot).size >= config.mPartnerNeed) {
                    var temp = `(${emotes.accept})`
                } else {
                    var temp = `(${emotes.denied})`
                }
                if(serverdata[msg.guild.id].lv >= 6) {
                    var temp_ = `(${emotes.accept})`
                } else {
                    var temp_ = `(${emotes.denied})`
                }
                var embed = new discord.MessageEmbed()
                    .setColor(color.normal)
                    .setTitle(`${emotes.partnerlogo} KeksBot Partner`)
                    .setDescription(`Eine KeksBot Partnerschaft bringt einige Vorteile mit sich.\nBeispielsweise erhöht sich das KeksLimit eines Partnerservers von ${config.maxlv5} Keksen pro Minute auf ${config.maxPartner}.\nAußerdem wird es in naher Zukunft diverse Partner Only Commands geben [WIP].\nDer Owner eines Partnerservers erhält neben dem Partner Abzeichen die Partnerrolle auf dem [KeksBot Support Server](https://discord.gg/g8AkYzWRCK) und somit Zugriff auf (mehr oder weniger) geheime Leaks. Zusätzlich erhöht sich das Nutzer-KeksLimit von Besitzern eines Partnerservers von den üblichen ${config.max} Keksen pro Minute auf ${config.maxP}. Weitere Vorteile sind aktuell in Planung.\n\nUm Partner werden zu können, verwende \`partner apply\`.Dies erstellt eine Einladung und sendet sie mit anderen Informationen über den Server (KeksBot Level und EP, Owner und Mitglieder) an das KeksBot Team. Wir werden diese Daten nicht weitergeben. Die Einladung ist nötig, da wir stichprobenartig überprüfen, ob der Server den KeksBot Regeln, Discord ToS und den deutschen Gesetzen entspricht. Sollte dies nicht der Fall sein, werden wir die Anfrage unverzüglich ablehnen. Sollte uns auffallen, dass ein Partnerserver gegen die eben genannten Vorlagen widerspricht, werden wir die Partnerschaft annulieren und den Server von der Botnutzung ausschließen. Sofern notwendig, werden wir den Fall ans Discord Trust and Safety Team weitergeben. Das KeksBot Team kann jegliche Anfragen ohne Begründung ablehnen und Partnerschaften auflösen. Sollte dies passieren, fragt bitte das ausführende Teammitglied nach dem Grund und pingt nicht wie wild die Supporter. Die können überhaupt nichts mit Partnerschaften machen und werden euch hierbei nicht helfen können.\nUm Partner zu werden braucht ihr ${config.mPartnerNeed} Mitglieder ${temp} und ${config.Partner} Erfahrungspunkte ${temp_}.`)
                msg.channel.send(embed).then(msg =>         
                    setTimeout(msg => {
                        if(!msg.deleted) {msg.delete()}
                    }, 90000, msg)
                )
        } else {
            const info = new discord.MessageEmbed()
                .setColor(color.normal)
                .setTitle('Partner | Info')
                .setDescription('Informationen zu KeksBot Partnerschaften.\nWir empfehlen, sie vor einer Bewerbung gründlich zu lesen.')
                .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                .setThumbnail(bild)
            const apply = new discord.MessageEmbed()
                .setColor(color.normal)
                .setTitle('Partner | Apply')
                .setDescription('Sendet eine Bewerbung an das KeksBot Team.\nDies ist die einzige Möglichkeit, Partner zu werden.\n**ACHTUNG:** Diese Funktion erstellt eine Einladung und sendet sie an die KeksBot Mods. Es kann sein, dass ein Teammitglied den Server überprüft, um KeksBot Regelverstöße und/oder Verstöße gegen die Discord ToS/deutschen Gesetze zu verhindern.')
                .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                .setThumbnail(bild)
            const cancel = new discord.MessageEmbed()
                .setColor(color.normal)
                .setTitle('Partner | Cancel')
                .setDescription('Zieht den Antrag zurück.\nEinfach so.')
                .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                .setThumbnail(bild)

            msg.channel.send(info).then(message => {
                message.react('1️⃣').then(r1 => {
                    message.react('2️⃣').then(r2 => {
                        message.react('3️⃣').then(async r3 => {
                            const filteri = (reaction, user) => reaction.emoji.name === r1.emoji.name && user.id == msg.author.id
                            const filtera = (reaction, user) => reaction.emoji.name === r2.emoji.name && user.id == msg.author.id
                            const filterc = (reaction, user) => reaction.emoji.name === r3.emoji.name && user.id == msg.author.id

                            const embedi = message.createReactionCollector(filteri, {time: 60000 })
                            const embeda = message.createReactionCollector(filtera, {time: 60000 })
                            const embedc = message.createReactionCollector(filterc, {time: 60000 })

                            embedi.on('collect', r => {
                                message.edit(info)
                                r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
                            })
                            embeda.on('collect', r => {
                                message.edit(apply)
                                r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
                            })
                            embedc.on('collect', r => {
                                message.edit(cancel)
                                r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
                            })
                            await delay(60000)
                            if(!message.deleted) message.delete()
                        })
                    })
                })
            })
        }
    }
}