const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['addserver', 'serveradd', 'add'],
    expectedArgs: '<Zahl || all>',
    minArgs: 1,
    maxArgs: 1,
    description: 'Fügt Kekse dem Server hinzu.',
    type: 'cookie',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        if (msg.guild.id in serverdata) {
            if(msg.author.id in userdata) {
            } else {
                userdata[msg.author.id] = {}
                userdata[msg.author.id].thismin = 0
                userdata[msg.author.id].xp = 0
                userdata[msg.author.id].lv = 1
                userdata[msg.author.id].cookies = 0
                userdata[msg.author.id].giftdm = 0
                if (config.support == 1) {
                    userdata[msg.author.id].firsthour = 1
                }
                fs.writeFileSync('./userdata.json',JSON.stringify(userdata, null, 2))
                console.log(`Daten für ${msg.author.username} | ${msg.author.id} angelegt.`)}
                arg = args[0]
                args = Number(arg)
                if((args <= userdata[msg.author.id].cookies) && (args > 0)) {
                    userdata[msg.author.id].cookies = Number(userdata[msg.author.id].cookies) - args
                    serverdata[msg.guild.id].xp = Number(serverdata[msg.guild.id].xp) + args
                    fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                    fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
                    if(serverdata[msg.guild.id].xp < config.lv2) {
                        serverdata[msg.guild.id].lv = 1
                        fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                    } else {
                        if((serverdata[msg.guild.id].xp >= config.lv2) && (serverdata[msg.guild.id].xp < config.lv3)) {
                            if(serverdata[msg.guild.id].lv <= 1) {
                                var embed = new discord.MessageEmbed()
                                    .setColor(0x00b99b)
                                    .setTitle("Level Up!")
                                    .setDescription(`${msg.guild.name} hat gerade **Level 2** erreicht.\nHerzlichen Glückwunsch!`)
                                    .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                    .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(message => message.channel.bulkDelete(1))
                            }
                            serverdata[msg.guild.id].lv = 2
                            fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                        } else {
                            if((serverdata[msg.guild.id].xp >= config.lv3) && (serverdata[msg.guild.id].xp < config.lv4)) {
                                if(serverdata[msg.guild.id].lv <= 2) {
                                    var embed = new discord.MessageEmbed()
                                        .setColor(0x00b99b)
                                        .setTitle("Level Up!")
                                        .setDescription(`${msg.guild.name} hat gerade **Level 3** erreicht.\nHerzlichen Glückwunsch!`)
                                        .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                        .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                    msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                }
                                serverdata[msg.guild.id].lv = 3
                                fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                            } else {
                                if((serverdata[msg.guild.id].xp >= config.lv4) && (serverdata[msg.guild.id].xp < config.lv5)) {
                                    if(serverdata[msg.guild.id].lv <= 3) {
                                        var embed = new discord.MessageEmbed()
                                            .setColor(0x00b99b)
                                            .setTitle("Level Up!")
                                            .setDescription(`${msg.guild.name} hat gerade **Level 4** erreicht.\nHerzlichen Glückwunsch!`)
                                            .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                            .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                        msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                    }
                                    serverdata[msg.guild.id].lv = 4
                                    fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                                } else {
                                    if((serverdata[msg.guild.id].xp >= config.lv5) && (serverdata[msg.guild.id].xp < config.Partner)) {
                                        if(serverdata[msg.guild.id].lv <= 4) {
                                            var embed = new discord.MessageEmbed()
                                                .setColor(0x00b99b)
                                                .setTitle("Level Up!")
                                                .setDescription(`${msg.guild.name} hat gerade **Level 5** erreicht.\nHerzlichen Glückwunsch!`)
                                                .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                                .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                            msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                        }
                                        serverdata[msg.guild.id].lv = 5
                                        fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                                    } else {
                                        if(serverdata[msg.guild.id].xp >= config.Partner) {
                                            if(serverdata[msg.guild.id].lv <= 5) {
                                                var embed = new discord.MessageEmbed()
                                                    .setColor(0x00b99b)
                                                    .setTitle("Partnerprogramm")
                                                    .setDescription(`Wow. Nach so vielen Keksen möchten wir uns erstmal bei euch bedanken!\nDanke, dass ihr den KeksBot verwendet. Es ist uns eine Ehre, euch schon so lange begeliten zu dürfen.\n
Als kleines Dankeschön möchten wir euch zu unserem Partnerprogramm einladen!\nEiner der vielen Vorteile eines Partnerservers ist ein auf ${config.maxPartner} erhöhtes Keks Limit pro Minute.\n
Außerdem erhält der Besitzer dieses Servers das Partner-Abzeichen (${emotes.partner}) und die Partner Rolle auf dem KeksBot Support Server.`)
                                                    .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                                    .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                                msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot//PARTNER'})).then(msg => msg.channel.bulkDelete(1))
                                            }
                                            serverdata[msg.guild.id].lv = 6
                                            fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if((serverdata[msg.guild.id].lv == 6) || (serverdata[msg.guild.id].lv == 7) || (serverdata[msg.guild.id].lv == 8)) {
                        embeds.success(msg, "Überweisung erfolgreich!",`Die Überweisung ist geglückt.\nDu hast nun ${userdata[msg.author.id].cookies} Kekse in deinem Lager.\nDieser Server hat nun ${serverdata[msg.guild.id].xp} EP und ist somit Level 5.`)
                    } else {
                        embeds.success(msg, "Überweisung erfolgreich!",`Die Überweisung ist geglückt.\nDu hast nun ${userdata[msg.author.id].cookies} Kekse in deinem Lager.\nDieser Server hat nun ${serverdata[msg.guild.id].xp} EP und ist somit Level ${serverdata[msg.guild.id].lv}.`)
                    }
                } else {
                    if(args > 0) {
                        embeds.error(msg, "Fehler", `Du hast nicht genügend Kekse.\nDir fehlen ${args - userdata[msg.author.id].cookies} Stück.`)
                    } else {
                        if(arg == 'all') {
                            serverdata[msg.guild.id].xp = serverdata[msg.guild.id].xp + userdata[msg.author.id].cookies
                            userdata[msg.author.id].cookies = 0
                            fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
                            if(serverdata[msg.guild.id].xp < config.lv2) {
                                serverdata[msg.guild.id].lv = 1
                                fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                            } else {
                                if((serverdata[msg.guild.id].xp >= config.lv2) && (serverdata[msg.guild.id].xp < config.lv3)) {
                                    if(serverdata[msg.guild.id].lv <= 1) {
                                        var embed = new discord.MessageEmbed()
                                            .setColor(0x00b99b)
                                            .setTitle("Level Up!")
                                            .setDescription(`${msg.guild.name} hat gerade **Level 2** erreicht.\nHerzlichen Glückwunsch!`)
                                            .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                            .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                        msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                    }
                                    serverdata[msg.guild.id].lv = 2
                                    fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                                } else {
                                    if((serverdata[msg.guild.id].xp >= config.lv3) && (serverdata[msg.guild.id].xp < config.lv4)) {
                                        if(serverdata[msg.guild.id].lv <= 2) {
                                            var embed = new discord.MessageEmbed()
                                                .setColor(0x00b99b)
                                                .setTitle("Level Up!")
                                                .setDescription(`${msg.guild.name} hat gerade **Level 3** erreicht.\nHerzlichen Glückwunsch!`)
                                                .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                                .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                            msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                        }
                                        serverdata[msg.guild.id].lv = 3
                                        fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                                    } else {
                                        if((serverdata[msg.guild.id].xp >= config.lv4) && (serverdata[msg.guild.id].xp < config.lv5)) {
                                            if(serverdata[msg.guild.id].lv <= 3) {
                                                var embed = new discord.MessageEmbed()
                                                    .setColor(0x00b99b)
                                                    .setTitle("Level Up!")
                                                    .setDescription(`${msg.guild.name} hat gerade **Level 4** erreicht.\nHerzlichen Glückwunsch!`)
                                                    .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                                    .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                                msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                            }
                                            serverdata[msg.guild.id].lv = 4
                                            fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                                        } else {
                                            if((serverdata[msg.guild.id].xp >= config.lv5) && (serverdata[msg.guild.id].xp < config.Partner)) {
                                                if(serverdata[msg.guild.id].lv <= 4) {
                                                    var embed = new discord.MessageEmbed()
                                                        .setColor(0x00b99b)
                                                        .setTitle("Level Up!")
                                                        .setDescription(`${msg.guild.name} hat gerade **Level 5** erreicht.\nHerzlichen Glückwunsch!`)
                                                        .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                                        .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                                    msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                                }
                                                serverdata[msg.guild.id].lv = 5
                                                fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                                            } else {
                                                if(serverdata[msg.guild.id].xp >= config.Partner) {
                                                    if(serverdata[msg.guild.id].lv <= 5) {
                                                        var embed = new discord.MessageEmbed()
                                                            .setColor(0x00b99b)
                                                            .setTitle("Partnerprogramm")
                                                            .setDescription(`Wow. Nach so vielen Keksen möchten wir uns erstmal bei euch bedanken!\nDanke, dass ihr den KeksBot verwendet. Es ist uns eine Ehre, euch schon so lange begeliten zu dürfen.\n
Als kleines Dankeschön möchten wir euch zu unserem Partnerprogramm einladen!\nEiner der vielen Vorteile eines Partnerservers ist ein auf ${config.maxPartner} erhöhtes Keks Limit pro Minute.\n
Außerdem erhält der Besitzer dieses Servers das Partner-Abzeichen (${emotes.partner}) und die Partner Rolle auf dem KeksBot Support Server.`)
                                                            .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                                            .setThumbnail(msg.guild.iconURL({dynamic: true}))
                                                        msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot//PARTNER'})).then(msg => msg.channel.bulkDelete(1))
                                                    }
                                                    serverdata[msg.guild.id].lv = 6
                                                    fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if((serverdata[msg.guild.id].lv == 6) || (serverdata[msg.guild.id].lv == 7) || (serverdata[msg.guild.id].lv == 8)) {
                                embeds.success(msg, "Überweisung erfolgreich!",`Die Überweisung ist geglückt.\nDu hast nun ${userdata[msg.author.id].cookies} Kekse in deinem Lager.\nDieser Server hat nun ${serverdata[msg.guild.id].xp} EP und ist somit Level 5.`)
                            } else {
                                embeds.success(msg, "Überweisung erfolgreich!",`Die Überweisung ist geglückt.\nDu hast nun ${userdata[msg.author.id].cookies} Kekse in deinem Lager.\nDieser Server hat nun ${serverdata[msg.guild.id].xp} EP und ist somit Level ${serverdata[msg.guild.id].lv}.`)
                            }
                        } else {
                            embeds.error(msg, "Syntaxfehler", "Bitte gib eine positive Zahl an.")
                        }
                    }
                }
        } else {
            embeds.error(msg, 'Systemfehler', 'Auf diesem Server wurde das System noch nicht aktiviert.\nBitte einen Administrator, es mit ``-activate`` zu starten.')
        }
    }
}
