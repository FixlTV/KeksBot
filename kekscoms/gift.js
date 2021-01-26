const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['gift', 'send', 'überweisen'],
    expectedArgs: '<@Nutzer> <Zahl>',
    minArgs: 2,
    maxArgs: 2,
    description: 'Verschenkt Kekse',
    type: 'cookie',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        var count = msg.content.split(' ')[2]
        var user
        msg.delete()
        try {
            if (userdata[msg.author.id]) {
                if(msg.mentions.members.first()) {
                    user = msg.mentions.members.first()
                } else if(msg.guild.members.cache.find(u => u.user.username == args[0]) != undefined) {
                    user = msg.guild.members.cache.find(u => u.user.username == args[0])
                } else if(msg.guild.members.cache.find(u => u.nickname == args[0]) != undefined) {
                    user = msg.guild.members.cache.find(u => u.nickname == args[0])
                } else {
                    try {
                        user = await cmsg.guild.members.fetch(args[0])
                    } catch (err) {}
                }
                if(user == undefined) {
                    embeds.error(msg, 'Syntaxfehler', `Bitte gib einen Nutzer an:\n${serverdata[msg.guild.id].prefix}gift **<@Nutzer \|\| Nutzername \|\| Nickname>** <Zahl>`)
                    return
                }
                if(isNaN(count)) {
                    embeds.error(msg, 'Syntaxfehler', `Bitte gib eine Zahl an:\n${serverdata[msg.guild.id].prefix}gift <@Nutzer> **<Zahl>**`)
                    return
                }
                if(user != undefined || !isNaN(count)) {
                    count = Number(count)
                    if(count > 0) {
                        if(userdata[user.id]) {
                            if(userdata[msg.author.id].cookies >= count) {
                                var embed = new discord.MessageEmbed()
                                    .setColor(color.yellow)
                                    .setTitle(`${emotes.pinging} Überweisung wird getätigt...`)
                                    .setDescription('Dies kann einige Zeit dauern...')
                                    .setFooter(`© KeksBot ${config.version}`,client.user.avatarURL())
                                msg.channel.send(embed).then(resultmsg => {
                                    userdata[msg.author.id].cookies = userdata[msg.author.id].cookies - count
                                    userdata[user.id].cookies = userdata[user.id].cookies + count
                                    fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
                                    if(userdata[user.id].giftdm == 1) {
                                        try {var dmembed = new discord.MessageEmbed()
                                            .setColor(color.normal)
                                            .setTitle('Keksgeschenk erhalten!')
                                            .setDescription(`**${msg.author.tag}** hat dir **${count}** Kekse geschenkt.`)
                                            .setThumbnail(msg.author.avatarURL())
                                            .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                                        user.createDM().then(channel => {
                                            channel.send(dmembed)
                                        })} catch (err) {
                                            console.log(`${user.tag} hat DMs nicht aktiviert. Die GiftDM konnte nicht zugestellt werden.`)
                                        }
                                    }
                                    embed.setColor(color.lime)
                                    embed.setTitle(`${emotes.accept} Überweisung erfolgreich`)
                                    if(count == 1) {
                                        embed.setDescription(`<@${user.id}> hat ${count} Keks von <@${msg.author.id}> erhalten.`)
                                    } else {
                                        embed.setDescription(`<@${user.id}> hat ${count} Kekse von <@${msg.author.id}> erhalten.`)
                                    }
                                    resultmsg.edit(embed).then(msg => msg.delete({ timeout: 10000 }))
                                })
                            } else {
                                embeds.error(msg, "Fehler", "Du hast nicht genügend Kekse.")
                            }
                        } else {
                            embeds.error(msg, "Fehler", "Der Nutzer ist nicht bekannt.")
                        }
                    } else {
                        embeds.error(msg, "Syntaxfehler", "Bitte gib eine positive Zahl an.")
                    }
                } else {
                    embeds.error(msg, "Syntaxfehler", `\`${serverdata[msg.guild.id].prefix}gift <@Nutzer> <Zahl>\``)
                }
            } else {
                embeds.error(msg, "Fehler", "Du hast keine Kekse.")
            }} catch (err) {
                embeds.error(msg, "Syntaxfehler", `\`${serverdata[msg.guild.id].prefix}gift <@Nutzer> <Zahl>\``)
                console.error(err)
        }
    }
}
