const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['eat', 'addme', 'happa', 'nomm', 'nom', 'happahappa'],
    expectedArgs: '<Zahl || all>',
    minArgs: 1,
    maxArgs: 1,
    description: 'Fügt Kekse als Erfahrungspunkte dem Nutzer hinzu. Dieser levelt mit der Zeit.',
    type: 'cookie',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
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
    console.log(`Daten für ${msg.author.username} | ${msg.author.id} angelegt.`)
}   
    const avatar = client.user.avatarURL()
    arg  = args[0]
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
                            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
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
                                .setFooter(`KeksBot ${config.version}`,client.user.avatarURL())
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
                                    .setFooter(`KeksBot ${config.version}`,avatar)
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
                                        .setFooter(`KeksBot ${config.version}`,avatar)
                                        .setThumbnail(msg.author.avatarURL())
                                    msg.channel.send('',embed)
                                }
                                userdata[msg.author.id].lv = 5
                            }
                        }
                    }
                }
            }
            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
            embeds.success(msg, "Happa Happa", `Du hast erfolgreich ${args} Kekse gegsessen.\nDu hast noch **${userdata[msg.author.id].cookies} Kekse** in deinem Lager frei zur Verfügung.\nAufgrund deiner **${userdata[msg.author.id].xp} Erfahrungspunkte** bist du Level **${userdata[msg.author.id].lv}**.`)
        } else {
            embeds.error(msg, "Fehler", `Du hast nicht genügend Kekse.\nDir fehlen ${userdata[msg.author.id].cookies - args} Stück.`)
        }
    } else {
        if(arg == 'all') {
            userdata[msg.author.id].xp = userdata[msg.author.id].xp + userdata[msg.author.id].cookies
            args = userdata[msg.author.id].cookies
            userdata[msg.author.id].cookies = 0
            if(userdata[msg.author.id].xp < config.maxlv1 * 4) {
                userdata[msg.author.id].lv = 1
            } else {
                if((userdata[msg.author.id].xp >= config.maxlv1 * 4) && (userdata[msg.author.id].xp < config.maxlv2 *4)) {
                    if(userdata[msg.author.id].lv < 2) {
                        var embed = new discord.MessageEmbed()
                            .setColor(color.normal)
                            .setTitle("Level Up!")
                            .setDescription(`<@${msg.author.id}> hat **Level 2** erreicht!\nHerzlichen Glückwunsch!`)
                            .setFooter(`KeksBot ${config.version}`,avatar)
                            .setThumbnail(msg.author.avatarURL())
                        msg.channel.send(embed)
                    }
                    userdata[msg.author.id].lv = 2
                } else {
                    if((userdata[msg.author.id].xp >= config.maxlv2 * 4) && (userdata[msg.author.id].xp < config.maxlv3 *4)) {
                        if(userdata[msg.author.id].lv < 3) {
                            var embed = new discord.MessageEmbed()
                                .setColor(color.normal)
                                .setTitle("Level Up!")
                                .setDescription(`<@${msg.author.id}> hat **Level 3** erreicht!\nHerzlichen Glückwunsch!`)
                                .setFooter(`KeksBot ${config.version}`,avatar)
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
                                    .setFooter(`KeksBot ${config.version}`,avatar)
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
                                        .setFooter(`KeksBot ${config.version}`,avatar)
                                        .setThumbnail(msg.author.avatarURL())
                                    msg.channel.send('',embed)
                                }
                                userdata[msg.author.id].lv = 5
                            }
                        }
                    }
                }
            }
            embeds.success(msg, "Happa Happa", `Du hast erfolgreich ${args} Kekse gegsessen.\nDu hast noch **${userdata[msg.author.id].cookies} Kekse** in deinem Lager frei zur Verfügung.\nAufgrund deiner **${userdata[msg.author.id].xp} Erfahrungspunkte** bist du Level **${userdata[msg.author.id].lv}**.`)
            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))

        } else {
            embeds.error(msg, "Syntaxfehler", "Bitte gib eine positive Zahl an.")
        }
    }
    }
}
