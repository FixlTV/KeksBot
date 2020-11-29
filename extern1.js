const discord = require('discord.js')
const fs      = require('fs')
const config  = JSON.parse(fs.readFileSync('./config.json'), null, 2)
const version = config.version
const emotes  = require('./emotes.json')
const cmdx    = require('./cmds.json')
const embeds = require('./embeds')

//content: extras: badge, help, ping, partner

const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}

module.exports = {
    badge(msg, avatar) {
        const VIPs = require('./VIP.json')
        const userdata = require('./userdata.json')
        var message
        var temp = []
        if(config.mods.includes(msg.author.id)) {
            temp.push(emotes.mod)
        }
        if(config.devs.includes(msg.author.id)) {
            temp.push(emotes.dev)
        }
        if(VIPs[msg.author.id] = 1) {
            temp.push(emotes.vip)
        }
        if(msg.author.id in userdata) {
        } else {
            userdata[msg.author.id] = {}
            userdata[msg.author.id].thismin = 0
            userdata[msg.author.id].xp = 0
            userdata[msg.author.id].lv = 1
            userdata[msg.author.id].cookies = 0
            fs.writeFileSync('userdata.json',JSON.stringify(userdata, null, 2))
            console.log(`Daten für ${msg.author.username} | ${msg.author.id} angelegt.`)}
        if(userdata[msg.author.id].partner == 1) {
            temp.push(emotes.partner)
        }

        if(temp == []) {
            temp.push('Du hast keine Abzeichen.')
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${msg.author.username}'s Abzeichen`)
            .setDescription(temp.join(' '))
            .setFooter(`© KeksBot ${version}`,avatar)
            .setThumbnail(msg.author.avatarURL())
        msg.channel.send("",embed).then((msg) => {
            message = msg
        }).then(msg.delete({ timeout: 60000 }))
        return Promise.resolve(message)
    },
    help(msg, avatar) {
        var type
        var message
        msg.delete()
        var embed = new discord.MessageEmbed()
            .setTitle(`${emotes.cookie} Hilfe`)
            .setDescription(`Keksbot Hilfe:
            \`${config.prefix}help <all | info | user | cookie | mod | admin>\``)
            .setColor(color.normal)
            .setFooter(`© KeksBot ${config.version}`, avatar)
        try {
            type = msg.content.split(' ')[1]
        } catch(err) {
            console.log(err)
        }
        if(type === "all") { //all
            embed.addField('Informationsbefehle', cmdx.info)
            embed.addField('Nutzerbefehle',cmdx.user)
            embed.addField('Keksbefehle', cmdx.cookie)
            embed.addField('Modbefehle', cmdx.mod)
            embed.addField('Administrationsbefehle', cmdx.admin)
        } else { //info
            if(type === "info") {
                embed.setTitle(`${emotes.cookie} Hilfe/Info`)
                embed.addField("help", "Zeigt das Hilfemenü an.")
                embed.addField("ping", "Zeigt die aktuelle Latenz an.")
            } else { //cookie
                if(type === "cookie") {
                    embed.setTitle(`${emotes.cookie} Hilfe/Kekse`)
                    embed.addField("kekse", "Gibt dir Kekse. Aliases: cookies")
                    embed.addField("addserver", "Fügt Kekse zu diesem Server hinzu.\nSie werden dir abgezogen und dem Server Erfahrungspunkten hinzugefügt.")
                    embed.addField("eat", "Fügt Kekse zu deinen Erfahrungspunkten hinzu.\nSie werden aus deinem Lager entfernt und helfen dir beim Leveln.")
                } else { //user
                    if(type === "user") {
                        embed.setTitle(`${emotes.cookie} Hilfe/User`)
                        embed.addField("badges", "Zeigt deine KeksBot-Abzeichen an.")                        
                    } else { //mod
                        if(type === "mod") {
                            embed.setTitle(`${emotes.cookie} Hilfe/Mod`)
                            embed.addField(":x:", "Bisher gibt es keine Befehle in dieser Kategorie.")
                        } else { //admin
                            if(type === "admin") {
                                embed.setTitle(`${emotes.cookie} Hilfe/Admin`)
                                embed.addField("activate", "Legt die nötigen Daten zur Aktiverung des Systems an.\nNur möglich, wenn bei der automatischen Generierung ein Fehler aufgetreten ist.")
                            } else { //else
                                embed.addField(`${config.prefix}help info`, "Zeigt Informationsbefehle an.")
                                embed.addField(`${config.prefix}help user`, "Zeigt Befehle an, die für jeden nutzbar sind.")
                                embed.addField(`${config.prefix}help cookie`, "Zeigt die Befehle des Kekssystems an.")
                                embed.addField(`${config.prefix}help mod`, "Zeigt Moderationsbefehle an.\nDiese können nur von bestimmten Rollen ausgeführt werden.")
                                embed.addField(`${config.prefix}help admin`, "Zeigt Administrationsbefehle an.\nNur Admins können diese Befehle verwenden.")
                            }
                        }
                    }
                }
            }
        }
        msg.channel.send('',embed).then((msg) => {
            msg.delete({ timeout: 60000 })
            message = msg
        })
        return Promise.resolve(message)
    },
    ping(msg, client) {
        msg.delete()
        var embed = new discord.MessageEmbed()
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} Pinging...`)
            .setDescription('Ich berechne gerade den Ping.\nDies kann einige Zeit dauern...')
            .setFooter(`© KeksBot ${version}`, client.user.avatarURL())
        msg.channel.send('',embed).then(resultmsg => {
            var ping = resultmsg.createdTimestamp - msg.createdTimestamp
            embed.setTitle(`${emotes.pinging} Pong!`)
            embed.setDescription(`:hourglass: Latenz: ${ping} ms\n:stopwatch: API Latenz: ${client.ws.ping} ms`)
            if(ping < 20) {
                embed.setColor(color.normal)
            } else { //Farbauswahl
                if(ping < 200) {
                    embed.setColor(color.lime)
                } else {
                    if(ping < 500) {
                        embed.setColor(color.yellow)
                    } else {
                        if(ping < 1000) {
                            embed.setColor(color.red)
                        } else {
                            embed.setColor(0x9c0010)
                        }
                    }
                }
            }
            resultmsg.edit('',embed).then(msg => msg.delete({ timeout: 5000 }))
        })
    },
    partner(msg, client) {
        msg.delete()
        const serverdata = require('./serverdata.json')
        const userdata   = require('./userdata.json')
        var gid        = msg.guild.id
        var id         = msg.author.id
        var type = msg.content.split(' ')[1]
        if(type === "apply") {
            if(msg.member.hasPermission('ADMINISTRATOR')) {
                if(serverdata[gid].lv == 6) {
                    if(msg.guild.members.cache.filter(member => !member.user.bot).size >= config.mPartnerNeed) {
                        var users = msg.guild.members.cache.filter(member => !member.user.bot).size
                        var bots  = msg.guild.members.cache.filter(member => member.user.bot).size
                        var embed = new discord.MessageEmbed()
                            .setColor(color.yellow)
                            .setTitle(`${emotes.pinging} Bewerbung wird eingereicht.`)
                            .setDescription('Eure Bewerbung wird initialisiert.\nDies kann einige Zeit dauern...')
                            .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                            .setImage('https://cdn.discordapp.com/attachments/782158455771365396/782189335130406912/partner.png')
                        msg.channel.send('',embed).then(resultmsg => {
                            try {
                                var embedx = new discord.MessageEmbed()
                                    .setTitle(`${msg.guild.name}`)
                                    .setColor(color.normal)
                                    .setDescription(`**<@${id}>** hat den Server **${msg.guild.name} | ${gid}** zur Verpartnerung angemeldet:`)
                                    .addField("XP:", serverdata[gid].xp, true)
                                    .addField("Nutzer:", users, true)
                                    .addField("Bots:", bots, true)
                                    .setThumbnail(msg.guild.iconURL())
                                client.channels.fetch('782158455771365396').then(channel => channel.send('<@&775002147846488085>',embedx).then(msg => msg.edit('',embedx)))
                                serverdata[gid].lv = 7
                                fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                                embed.setColor(color.lime)
                                embed.setTitle(`${emotes.accept} Eure Bewerbung wurde abgesendet!`)
                                embed.setDescription("**Herzlichen Glückwunsch!**\n\nEure Bewerbung wurde erfolgreich versendet.\nBitte habt etwas Geduld und wartet die Ergebnisse ab. Uns Druck machen hilft leider auch nichts.")
                                resultmsg.edit('',embed)
                            } catch (err) {
                                console.log('Bei der Partnerschaftsbewerbung ist ein Fehler unterlaufen:')
                                console.log('-----------------------------------------------------------')
                                console.log(err)
                                console.log('-----------------------------------------------------------')
                                embed.setColor(color.red)
                                embed.setTitle(`${emotes.denied} Ein Fehler ist aufgetreten.`)
                                embed.setDescription('Bei eurer Bewerbung ist ein Fehler aufgetreten.\nDer Fehler wurde aufgezeichnet und wird möglichst bald behoben werden.\n\nWir entschuldigen uns für die Unannehmlichkeiten.')
                                resultmsg.edit('',embed)
                            }
                        })
                    } else {
                        embeds.error(msg, "Mitgliederzahl zu niedrig!", `Für eine Partnerschaft benötigst du ${config.mPartnerNeed} Mitglieder (keine Bots!).
                        Auf diesem Server sind aber nur ${msg.guild.members.cache.filter(member => !member.user.bot).size} Mitglieder`)
                    }
                } else {
                    if(serverdata[gid].lv == 7) {
                        embeds.error(msg, "Fehler", "Ihr habt bereits einen Antrag getellt, der noch nicht beantwortet wurde. Habt noch ein bisschen Geduld.")
                    } else {
                        embeds.error(msg, "Level zu niedrig!", `Um diesen Befehl zu nutzen, muss dieser Server ${config.Partner} Kekse haben.
                        Dieser Server hat nur ${serverdata[gid].xp} Kekse, somit fehlen ${config.Partner - serverdata[gid].xp}.`)
    
                    }
                }
            } else {
                embeds.needperms(msg, 'ADMINISTRATOR')
            }
        } else {
            if(type === "info") {
                var embed = new discord.MessageEmbed()
                    .setColor(color.normal)
                    .setTitle("Partnerpogramm")
                    .setDescription("Der KeksBot verfügt über ein Partnerprogramm, bei dem sich Server anmelden können.\nEine Partnerschaft ist erst möglich, wenn diverse Vorraussetzungen erfüllt sind.")
                    .addField('Server-Vorteile', `Auf ${config.maxPartner} erhöhtes Keks-Limit\nWeitere folgen bald...`, true)
                    .addField('Owner-Vorteile', 'Partner-Abzeichen\nPartner Rolle auf dem KeksBot Support Server.', true)
                    .addField('Vorraussetzungen', `Mindestens ${config.Partner} Kekse\nMindestens ${config.mPartnerNeed} Mitglieder (keine Bots!)`, true)
                msg.channel.send('',embed)
            } else {
                if(type === "accept") {
                    gid = msg.content.split(' ')[2]
                    if(config.mods.includes(msg.author.id)) {
                        if(!isNaN(gid)) {
                            if(serverdata[gid]) {
                                if(serverdata[gid].lv == 7) {
                                    client.guilds.fetch(gid).then(guild => {
                                        var g = guild
                                    if(!userdata[g.ownerID].partner) {
                                        userdata[g.ownerID].partner = 1
                                    } else {
                                        userdata[g.ownerID].partner = userdata[g.ownerID] + 1
                                    }
                                    serverdata[gid].lv = 8
                                    serverdata[gid].partner = 1
                                    fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                                    fs.writeFileSync('userdata.json',JSON.stringify(userdata, null, 2))
                                    client.channels.fetch('782307664528277536').then(channel => {
                                        var embed = new discord.MessageEmbed()
                                            .setColor(color.normal)
                                            .setTitle(`Neuer Partner: ${g.id}`)
                                            .setDescription(`Der Server **${g.name}** von <@${g.ownerID}> ist nun Partner! Herzlichen Glückwunsch!`)
                                            .addField('Serverinfos', `Mitglieder: ${g.memberCount}
                                            Davon Nutzer: ${msg.guild.members.cache.filter(member => !member.user.bot).size}
                                            Davon Bots: ${msg.guild.members.cache.filter(member => member.user.bot).size}
                                            Erfahrungspunkte: ${serverdata[gid].xp}`)
                                            .setFooter(`© KeksBot ${version}`,client.user.avatarURL())
                                            .setThumbnail(g.iconURL())
                                        channel.send('',embed)
                                    try {
                                        var embed = new discord.MessageEmbed()
                                            .setColor(color.normal)
                                            .setTitle("Partnerprogramm")
                                            .setDescription(`**Herzlichen Glückwunsch!**
                                            Ihr seid nun offiziell KeksBot Partner!
                                            Vielen Dank, dass ihr unsere Kekse esst. Seit wir für euch Kekse dupen, habt ihr ${serverdata[gid].xp} Kekse gespendet.`)
                                            .setImage('https://cdn.discordapp.com/attachments/782158455771365396/782189335130406912/partner.png')
                                            .setThumbnail(g.iconURL())
                                            .setFooter(`© KeksBot ${version}`,client.user.avatarURL())
                                        g.systemChannel.send(`<@${g.ownerID}> Ping! Du bist Partner.`,embed).then(msg => msg.edit('',embed))
                                    } catch (err) {
                                        var embed = new discord.MessageEmbed()
                                            .setColor(color.normal)
                                            .setTitle("Partnerprogramm")
                                            .setDescription(`**Herzlichen Glückwunsch!**
                                            Dein Server **${g.name}** ist nun offiziell KeksBot Partner!
                                            Vielen Dank, dass ihr unsere Kekse esst. Seit wir für euch Kekse dupen, habt ihr ${serverdata[gid].xp} Kekse gespendet.`)
                                            .setImage('https://cdn.discordapp.com/attachments/782158455771365396/782189335130406912/partner.png')
                                            .setThumbnail(g.iconURL())
                                            .setFooter(`© KeksBot ${version}`,client.user.avatarURL())
                                        g.owner.user.createDM().then(channel => channel.send('', embed))
                                    }})})
                                } else {
                                    embeds.error(msg, "Fehler", `${gid} hat sich nicht beworben.`)
                                }
                            } else {
                                embeds.error(msg, "Syntaxfehler", `${gid} ist keine verwendete Server-ID.`)
                            }
                        } else {
                            embeds.error(msg, "Syntaxfehler", `${gid} ist keine Zahl.`)
                        }
                    } else {
                        embeds.needperms(msg, 'BOT-MODERATOR')
                    }
                } else {
                    if(type === "cancel") {
                        if(msg.member.hasPermission('ADMINISTRATOR')) {
                            if(serverdata[gid].lv == 7) {
                                var embed = new discord.MessageEmbed()
                                    .setColor(color.yellow)
                                    .setTitle(`${emotes.pinging} Bewerbung wird zurückgezogen.`)
                                    .setDescription('Dies kann einige Zeit dauern.')
                                    .setFooter(`© KeksBot ${version}`,client.user.avatarURL())
                                msg.channel.send('', embed).then(resultmsg => {
                                    serverdata[gid].lv = 6
                                    fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
                                    embed.setColor(color.lime)
                                    embed.setTitle(`${emotes.accept} Bewerbung abgebrochen.`)
                                    embed.setDescription('Eure Bewerbung wurde erfolgreich zurückgenommen.')
                                    resultmsg.edit(embed)
                                })
                            } else {
                                if(serverdata[gid].lv == 8) {
                                    embeds.error(msg, "Fehler", "Ihr seid bereits Partner.")
                                } else {
                                    embeds.error(msg, "Fehler", "Ihr habt euch (noch) nicht beworben.")
                                }
                            }
                        } else {
                            embeds.needperms(msg, 'ADMINISTRATOR')
                        }
                    } else {
                        if(type === "reject") {
                            gid = msg.content.split(' ')[2]
                            reason = msg.content.split(' ').slice(3)
                            if(reason = []) {
                                reason = ['Keine']
                            }
                            if(config.mods.includes(msg.author.id)) {
                                if(serverdata[gid].lv == 7) {
                                    var embed = new discord.MessageEmbed()
                                    .setColor(color.yellow)
                                    .setTitle(`${emotes.pinging} Anfrage wird abgelehnt...`)
                                    .setDescription('Dies kann einige Zeit dauern.')
                                    .addField('Begründung:', reason.join(' '))
                                    .setFooter(msg.author.tag, msg.author.avatarURL())
                                msg.channel.send(embed).then(resultmsg => {
                                    serverdata[gid].lv = 6
                                    fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
                                    client.guilds.fetch(gid).then(guild => {
                                    var embedx = new discord.MessageEmbed()
                                        .setColor(color.red)
                                        .setTitle(`${emotes.denied} Partnerschaftsantrag abgelehnt.`)
                                        .setDescription('Euer Partnerschaftsantrag wurde leider abgelehnt.')
                                        .setThumbnail(guild.iconURL())
                                        .addField('Begründung:', reason.join(' '))
                                        .setFooter(msg.author.tag, msg.author.avatarURL())
                                    guild.owner.user.createDM().then(channel => channel.send('', embedx))
                                    embed.setColor(color.lime)
                                    embed.setTitle(`${emotes.accept} Partnerschaft erfolgreich abgelehnt.`)
                                    embed.setDescription(`Die Partnerschaft mit **${guild.name}** wurde erfolgreich abgelehnt.`)
                                    resultmsg.edit(embed).then(msg => msg.delete({ timeout: 10000 }))
                                })})
                                } else {
                                    if(serverdata[gid].lv == 8) {
                                        embeds.error(msg, "Fehler", "Dieser Server ist bereits Partner.")
                                    } else {
                                        if(serverdata[gid]) {
                                            embeds.error(msg, "Fehler", "Dieser Server hat sich nicht beworben.")
                                        } else {
                                            embeds.error(msg, "Fehler", "Diesen Sever gibt es nicht oder er ist nicht aktiviert.")
                                        }
                                    }
                                }
                            } else {
                                embeds.needperms(msg, 'BOT-MODERATOR')
                            }
                        } else {
                            if(type === "revoke") {
                                var gid = msg.content.split(' ')[2]
                                var reason = msg.content.split(' ').slice(3)
                                if(reason = []) {
                                    reason = ['Keine']
                                }
                                if(config.mods.includes(msg.author.id)) {
                                    if(serverdata[gid].partner = 1) {
                                        var embed = new discord.MessageEmbed()
                                            .setColor(color.yellow)
                                            .setTitle(`${emotes.pinging} Partnerstatus wird entzogen...`)
                                            .setDescription('Dies kann einige Zeit dauern...')
                                            .addField('Begründung:', reason.join(' '))
                                            .setFooter(msg.author.tag, msg.author.avatarURL())
                                        msg.channel.send(embed).then(resultmsg => {
                                            client.guilds.fetch(gid).then(guild => {
                                            var embedx = new discord.MessageEmbed()
                                                .setColor(color.red)
                                                .setTitle('Deine Partnerschaft wurde entzogen.')
                                                .setDescription(`Hey ${guild.owner.user.username}, 
                                                Es tut uns sehr leid, aber wir mussten dir die Partnerschaft von deinem Server ${guild.name} entziehen.
                                                Vielen Dank für dein Verständnis.`)
                                                .addField('Begründung:', reason.join(' '))
                                                .setFooter(msg.author.tag, msg.author.avatarURL())
                                            guild.owner.user.createDM().then(channel => channel.send(embedx))
                                            delete(serverdata[gid].partner)
                                            serverdata[gid].lv = 6
                                            if(userdata[guild.ownerID].partner == 1) {
                                                delete(userdata[guild.ownerID].partner)
                                            } else {
                                                userdata[guild.ownerID].partner = userdata[guild.ownerID].partner - 1
                                            }
                                            fs.writeFileSync('userdata.json', JSON.stringify(userdata, null, 2))
                                            fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
                                            embed.setColor(color.lime)
                                            embed.setTitle(`${emotes.accept} Partnerschft beendet.`)
                                            embed.setDescription(`Die Partnerschaft mit **${guild.name}** wurde erfolgreich annuliert.`)
                                            resultmsg.edit(embed)
                                        })})
                                    } else {
                                        embeds.error(msg, "Fehler", "Dieser Server ist kein Partner.")
                                    }
                                } else {
                                    embeds.needperms(msg, 'BOT-MODERATOR')
                                }
                            } else {
                                var embed = new discord.MessageEmbed()
                                    .setColor(color.normal)
                                    .setTitle(`KeksBot Partnerschaften`)
                                    .setDescription('Hilfe für die Partner-Befehle.')
                                    .addField(`${config.prefix}partner apply`, 'Sendet automatisch eine Partnerschaftsbewerbung an den KeksBot Supoort Server.')
                                    .addField(`${config.prefix}partner cancel`, 'Ruft deine Bewerbung zurück.')
                                    .addField(`${config.prefix}partner info`, 'Zeigt Infomationen über die Verpartnerung an.')
                                    .setThumbnail('https://cdn.discordapp.com/attachments/780008420785782784/782596008466186240/partnerserver.png')
                                    if(config.mods.includes(msg.author.id)) {
                                        embed.addField(`${config.prefix}partner accept <ID>`, 'Akzeptiere die Bewerbung eines Servers und mache ihn zum Partner. [MOD-ONLY]')
                                        embed.addField(`${config.prefix}partner reject <ID> <Begründung>`, 'Weise die Bewerbung eines Servers zurück. Er wird kein Parter [MOD-ONLY]')
                                        embed.addField(`${config.prefix}partner revoke <ID> <Begründung>`, 'Löse eine Partnerschaft auf. [MOD-ONLY]')
                                    msg.channel.send(embed).then(msg => msg.delete({ timeout: 30000 }))
                                    }
                            }
                        }
                    }
                }
            }
        }
    }
}
