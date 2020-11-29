const discord = require('discord.js')
const fs      = require('fs')
const config  = JSON.parse(fs.readFileSync('./config.json'))
const embeds  = require('./embeds')
const emotes  = require('./emotes.json')

//main data script

const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}

module.exports = {
    kekse(msg, args) {
        var xmessage
        msg.delete()
        const userdata = require('./userdata.json')
        const serverdata = require('./serverdata.json')
        var id = String(msg.author.id)
        if(id in userdata) {
        } else {
            userdata[id] = {}
            userdata[id].thismin = 0
            userdata[id].xp = 0
            userdata[id].lv = 1
            userdata[id].cookies = 0
            fs.writeFileSync('userdata.json',JSON.stringify(userdata, null, 2))
            console.log(`Daten für ${msg.author.username} | ${msg.author.id} angelegt.`)
        }
        if(msg.guild.id in serverdata) {
            if(!isNaN(args.join(' '))) {
                if(args.join('') > 0) {
                    var VIPs = JSON.parse(fs.readFileSync('./VIP.json'))
                    if(VIPs[msg.author.id] = 1) { //if user is VIP
                    if(args > config.maxVIP - userdata[id].thismin) {
                        args = config.maxVIP - userdata[id].thismin
                    }
                    } else { //if user is not VIP
                    if(args > config.max - userdata[id].thismin) {
                        args = config.max - userdata[id].thismin
                    }
                    }
                    if(serverdata[msg.guild.id].lv = 1) { //if server is lv 1
                    if(args > config.maxlv1 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv1 - serverdata[msg.guild.id].thismin
                    }
                    }
                    if(serverdata[msg.guild.id].lv = 2) { //if server is lv 2
                    if(args > config.maxlv2 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv2 - serverdata[msg.guild.id].thismin
                    }
                    }
                    if(serverdata[msg.guild.id].lv = 3) { //if server is lv 3
                    if(args > config.maxlv3 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv3 - serverdata[msg.guild.id].thismin
                    }
                    }
                    if(serverdata[msg.guild.id].lv = 4) { //if server is lv 4
                    if(args > config.maxlv4 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv4 - serverdata[msg.guild.id].thismin
                    }
                    }
                    //if server is lv 5
                    if((serverdata[msg.guild.id].lv = 5) || (serverdata[msg.guild.id].lv = 6) || (serverdata[msg.guild.id].lv = 7)) {
                    if(args > config.maxlv5 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv5 - serverdata[msg.guild.id].thismin
                    }
                    }
                    if((serverdata[msg.guild.id].partner == 1)) { //if server is partnered
                        if(args > config.maxPartner - serverdata[msg.guild.id].thismin) {
                            args = config.maxPartner - serverdata[msg.guild.id].thismin
                        }
                    }
                    args = Number(args)
                    userdata[id].cookies = Number(userdata[id].cookies) + Number(args)
                    serverdata[msg.guild.id].thismin = Number(serverdata[msg.guild.id].thismin) + args
                    userdata[id].thismin = Number(userdata[id].thismin) + args
                    fs.writeFileSync('userdata.json',JSON.stringify(userdata, null, 2))
                    fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
                    embeds.cookie(msg, args, userdata[id].cookies)
                } else {
                    embeds.error(msg, "Syntaxfehler", "Bitte gib eine positive Zahl an.")
                }
            } else {
                embeds.error(msg, 'Syntaxfehler', `${args.join(' ')} ist keine gültige Zahl.`)
            }
        } else {
            embeds.error(msg, 'Systemfehler', 'Auf diesem Server wurde das System noch nicht aktiviert.\nBitte einen Administrator, es mit ``-activate`` zu starten.')
        }    
        return Promise.resolve(xmessage)

    },
    addserver(msg, args, avatar) {
        msg.delete()
        const userdata = require('./userdata.json')
        const serverdata = require('./serverdata.json')
        if (msg.guild.id in serverdata) {
            if(msg.author.id in userdata) {
            } else {
                userdata[msg.author.id] = {}
                userdata[msg.author.id].thismin = 0
                userdata[msg.author.id].xp = 0
                userdata[msg.author.id].lv = 1
                userdata[msg.author.id].cookies = 0
                fs.writeFileSync('userdata.json',JSON.stringify(userdata, null, 2))
                console.log(`Daten für ${msg.author.username} | ${msg.author.id} angelegt.`)}
            if(!isNaN(args.join(' '))) {
                args = Number(args)
                if((args <= userdata[msg.author.id].cookies) && (args > 0)) {
                    userdata[msg.author.id].cookies = Number(userdata[msg.author.id].cookies) - args
                    serverdata[msg.guild.id].xp = Number(serverdata[msg.guild.id].xp) + args
                    fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                    fs.writeFileSync('userdata.json', JSON.stringify(userdata, null, 2))
                    if((serverdata[msg.guild.id].lv == 6) || (serverdata[msg.guild.id].lv == 7) || (serverdata[msg.guild.id].lv == 8)) {
                        embeds.success(msg, "Überweisung erfolgreich!",`Die Überweisung ist geglückt.\nDu hast nun ${userdata[msg.author.id].cookies} Kekse in deinem Lager.\nDieser Server hat nun ${serverdata[msg.guild.id].xp} EP und ist somit Level 5.`)
                    } else {
                        embeds.success(msg, "Überweisung erfolgreich!",`Die Überweisung ist geglückt.\nDu hast nun ${userdata[msg.author.id].cookies} Kekse in deinem Lager.\nDieser Server hat nun ${serverdata[msg.guild.id].xp} EP und ist somit Level ${serverdata[msg.guild.id].lv}.`)
                    }
                    if(serverdata[msg.guild.id].xp < config.lv2) {
                        serverdata[msg.guild.id].lv = 1
                        fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                    } else {
                        if((serverdata[msg.guild.id].xp >= config.lv2) && (serverdata[msg.guild.id].xp < config.lv3)) {
                            if(serverdata[msg.guild.id].lv == 1) {
                                var embed = new discord.MessageEmbed()
                                    .setColor(0x00b99b)
                                    .setTitle("Level Up!")
                                    .setDescription(`${msg.guild.name} hat gerade **Level 2** erreicht.\nHerzlichen Glückwunsch!`)
                                    .setFooter(`© KeksBot ${config.version}`,avatar)
                                    .setThumbnail(msg.guild.iconURL())
                                msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                            }
                            serverdata[msg.guild.id].lv = 2
                            fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                        } else {
                            if((serverdata[msg.guild.id].xp >= config.lv3) && (serverdata[msg.guild.id].xp < config.lv4)) {
                                if(serverdata[msg.guild.id].lv == 2) {
                                    var embed = new discord.MessageEmbed()
                                        .setColor(0x00b99b)
                                        .setTitle("Level Up!")
                                        .setDescription(`${msg.guild.name} hat gerade **Level 3** erreicht.\nHerzlichen Glückwunsch!`)
                                        .setFooter(`© KeksBot ${config.version}`,avatar)
                                        .setThumbnail(msg.guild.iconURL())
                                    msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                }
                                serverdata[msg.guild.id].lv = 3
                                fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                            } else {
                                if((serverdata[msg.guild.id].xp >= config.lv4) && (serverdata[msg.guild.id].xp < config.lv5)) {
                                    if(serverdata[msg.guild.id].lv == 3) {
                                        var embed = new discord.MessageEmbed()
                                            .setColor(0x00b99b)
                                            .setTitle("Level Up!")
                                            .setDescription(`${msg.guild.name} hat gerade **Level 4** erreicht.\nHerzlichen Glückwunsch!`)
                                            .setFooter(`© KeksBot ${config.version}`,avatar)
                                            .setThumbnail(msg.guild.iconURL)
                                        msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                    }
                                    serverdata[msg.guild.id].lv = 4
                                    fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                                } else {
                                    if((serverdata[msg.guild.id].xp >= config.lv5) && (serverdata[msg.guild.id].xp < config.Partner)) {
                                        if(serverdata[msg.guild.id].lv == 4) {
                                            var embed = new discord.MessageEmbed()
                                                .setColor(0x00b99b)
                                                .setTitle("Level Up!")
                                                .setDescription(`${msg.guild.name} hat gerade **Level 5** erreicht.\nHerzlichen Glückwunsch!`)
                                                .setFooter(`© KeksBot ${config.version}`,avatar)
                                                .setThumbnail(msg.guild.iconURL())
                                            msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot LevelUp'})).then(msg => msg.channel.bulkDelete(1))
                                        }
                                        serverdata[msg.guild.id].lv = 5
                                        fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                                    } else {
                                        if(serverdata[msg.guild.id].xp >= config.Partner) {
                                            if(serverdata[msg.guild.id].lv == 5) {
                                                var embed = new discord.MessageEmbed()
                                                    .setColor(0x00b99b)
                                                    .setTitle("Partnerprogramm")
                                                    .setDescription(`Wow. Nach so vielen Keksen möchten wir uns erstmal bei euch bedanken!\nDanke, dass ihr den KeksBot verwendet. Es ist uns eine Ehre, euch schon so lange begeliten zu dürfen.\n
                                                    Als kleines Dankeschön möchten wir euch zu unserem Partnerprogramm einladen!\nEiner der vielen Vorteile eines Partnerservers ist ein auf ${config.maxPartner} erhöhtes Keks Limit pro Minute.\n
                                                    Außerdem erhält der Besitzer dieses Servers das Partner-Abzeichen (${emotes.partner}) und die Partner Rolle auf dem KeksBot Support Server.`)
                                                    .setFooter(`© KeksBot ${config.version}`,avatar)
                                                    .setThumbnail(msg.guild.iconURL())
                                                msg.channel.send('',embed).then(resultmsg => resultmsg.pin({ reason: 'KeksBot//PARTNER'})).then(msg => msg.channel.bulkDelete(1))
                                            }
                                            serverdata[msg.guild.id].lv = 6
                                            fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if(args > 0) {
                        embeds.error(msg, "Fehler", `Du hast nicht genügend Kekse.\nDir fehlen ${args - userdata[msg.author.id].cookies} Stück.`)
                    } else {
                        embeds.error(msg, "Syntaxfehler", "Bitte gib eine positive Zahl an.")
                    }
                }
            } else {
                embeds.error(msg, 'Syntaxfehler', `${args.join(' ')} ist keine gültige Zahl.`)
            }
        } else {
            embeds.error(msg, 'Systemfehler', 'Auf diesem Server wurde das System noch nicht aktiviert.\nBitte einen Administrator, es mit ``-activate`` zu starten.')
        }
    },
    eat(msg, args, avatar) {
        msg.delete()
        const userdata = require('./userdata.json')
        if(msg.author.id in userdata) {
        } else {
            userdata[msg.author.id] = {}
            userdata[msg.author.id].thismin = 0
            userdata[msg.author.id].xp = 0
            userdata[msg.author.id].lv = 1
            userdata[msg.author.id].cookies = 0
            fs.writeFileSync('userdata.json',JSON.stringify(userdata, null, 2))
            console.log(`Daten für ${msg.author.username} | ${msg.author.id} angelegt.`)
        }
        if(!isNaN(args.join(' '))) {
            args = Number(args)
            if(args > 0) {
                if(args <= userdata[msg.author.id].cookies) {
                    userdata[msg.author.id].cookies = userdata[msg.author.id].cookies - args
                    userdata[msg.author.id].xp = userdata[msg.author.id].xp + args
                    if(userdata[msg.author.id].xp < config.maxlv1 * 4) {
                        userdata[msg.author.id].lv = 1
                    } else {
                        if((userdata[msg.author.id].xp >= config.maxlv1 * 4) && (userdata[msg.author.id].xp < config.maxlv2 *4)) {
                            if(userdata[msg.author.id].lv < 2) {
                                var embed = new discord.MessageEmbed()
                                    .setColor(color.normal)
                                    .setTitle("Level Up!")
                                    .setDescription(`<@${msg.author.id}> hat **Level 2** erreicht!\nHerzlichen Glückwunsch!`)
                                    .setFooter(`© KeksBot ${config.version}`,avatar)
                                    .setThumbnail(msg.author.avatarURL())
                                msg.channel.send('',embed)
                            }
                            userdata[msg.author.id].lv = 2
                        } else {
                            if((userdata[msg.author.id].xp >= config.maxlv2 * 4) && (userdata[msg.author.id].xp < config.maxlv3 *4)) {
                                if(userdata[msg.author.id].lv < 3) {
                                    var embed = new discord.MessageEmbed()
                                        .setColor(color.normal)
                                        .setTitle("Level Up!")
                                        .setDescription(`<@${msg.author.id}> hat **Level 3** erreicht!\nHerzlichen Glückwunsch!`)
                                        .setFooter(`© KeksBot ${config.version}`,avatar)
                                        .setThumbnail(msg.author.avatarURL())
                                    msg.channel.send('',embed)
                                }
                                userdata[msg.author.id].lv = 3
                            } else {
                                if((userdata[msg.author.id].xp >= config.maxlv3 * 4) && (userdata[msg.author.id].xp < config.maxlv4 *4)) {
                                    if(userdata[msg.author.id].lv < 4) {
                                        var embed = new discord.MessageEmbed()
                                            .setColor(color.normal)
                                            .setTitle("Level Up!")
                                            .setDescription(`<@${msg.author.id}> hat **Level 4** erreicht!\nHerzlichen Glückwunsch!`)
                                            .setFooter(`© KeksBot ${config.version}`,avatar)
                                            .setThumbnail(msg.author.avatarURL())
                                        msg.channel.send('',embed)
                                    }
                                    userdata[msg.author.id].lv = 4
                                } else {
                                    if(userdata[msg.author.id].xp >= config.maxlv4 * 4) {
                                        if(userdata[msg.author.id].lv < 5) {
                                            var embed = new discord.MessageEmbed()
                                                .setColor(color.normal)
                                                .setTitle("Level Up!")
                                                .setDescription(`<@${msg.author.id}> hat **Level 5** erreicht!\nHerzlichen Glückwunsch!`)
                                                .setFooter(`© KeksBot ${config.version}`,avatar)
                                                .setThumbnail(msg.author.avatarURL())
                                            msg.channel.send('',embed)
                                        }
                                        userdata[msg.author.id].lv = 5
                                    }
                                }
                            }
                        }
                    }
                    fs.writeFileSync('userdata.json', JSON.stringify(userdata, null, 2))
                    embeds.success(msg, "Überweisung erfolgreich!", `Die Überweisung in Höhe von ${args} Kekse ist geglückt.
                    Du hast noch ${userdata[msg.author.id].cookies} Kekse in deinem Lager frei zur Verfügung.
                    Aufgrund deiner ${userdata[msg.author.id].xp} Erfahrungspunkten bist du Level ${userdata[msg.author.id].lv}.`)
                } else {
                    embeds.error(msg, "Fehler", `Du hast nicht genügend Kekse.
                    Dir fehlen ${userdata[msg.author.id].cookies - args} Stück.`)
                }
            } else {
                embeds.error(msg, "Syntaxfehler", "Bitte gib eine positive Zahl an.")
            }
        } else {
            embeds.error(msg, "Syntaxfehler", `${args.join(' ')} ist keine gültige Zahl.`)
        }
    }
}