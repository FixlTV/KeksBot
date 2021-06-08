const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')
const searchmembers = require('../subcommands/searchmembers')
const delay = require('delay')

module.exports = {
    commands: ['gift', 'send', 'überweisen'],
    expectedArgs: '<@Nutzer> <Zahl>',
    minArgs: 2,
    description: 'Verschenkt Kekse',
    type: 'cookie',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        var count = args[1]
        var user
        msg.delete()
        if (userdata[msg.author.id]) {
            var result = await searchmembers(msg, args, args.join(' '))
            user = result[0][0]
            count = result[1].split(' ')[0]
            if(!user) return embeds.error(msg, 'Syntaxfehler', `Bitte gib einen Nutzer an:\n${serverdata[msg.guild.id].prefix}gift **<@Nutzer \| Nutzername \| Nickname>** <Zahl>`)
            if(isNaN(count) || count < 1) return embeds.error(msg, 'Syntaxfehler', `Bitte gib eine positive Zahl an:\n${serverdata[msg.guild.id].prefix}gift <@Nutzer> **<Zahl>**`)
            if(!userdata[user.id]) {
                userdata[user.id] = {}
                userdata[user.id].thismin = 0
                userdata[user.id].xp = 0
                userdata[user.id].lv = 1
                userdata[user.id].cookies = 0
                userdata[user.id].giftdm = 0
                if (config.support == 1) {
                    userdata[user.id].firsthour = 1
                }
            }
            count = Number(count)
            if(userdata[msg.author.id].cookies < count) return embeds.error(msg, "Fehler", "Du hast nicht genügend Kekse.")
            var embed = new discord.MessageEmbed()
                .setColor(color.yellow)
                .setTitle(`${emotes.pinging} Überweisung wird getätigt...`)
                .setDescription('Dies kann einige Zeit dauern...')
                .setFooter(`KeksBot ${config.version}`,client.user.avatarURL())
            msg.channel.send(embed).then(async (resultmsg) => {
                userdata[msg.author.id].cookies = userdata[msg.author.id].cookies - count
                userdata[user.id].cookies = userdata[user.id].cookies + count
                fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
                if(userdata[user.id].giftdm && userdata[user.id].giftdm > 0) {
                    var dmembed = new discord.MessageEmbed()
                        .setColor(color.normal)
                        .setTitle('Keksgeschenk erhalten!')
                        .setDescription(`**${msg.author.tag}** hat dir **${count}** Kekse geschenkt.`)
                        .setThumbnail(msg.author.avatarURL())
                        .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
                    user.createDM()
                        .then(channel => {
                            channel.send(dmembed).catch(`${user.tag} hat DMs nicht aktiviert.`)
                        })
                        .catch(`${user.tag} hat DMs nicht aktiviert.`)
                }
                embed.setColor(color.lime)
                embed.setTitle(`${emotes.accept} Überweisung erfolgreich`)
                if(count == 1) {
                    embed.setDescription(`<@${user.id}> hat einen Keks von <@${msg.author.id}> erhalten.`)
                } else {
                    embed.setDescription(`<@${user.id}> hat ${count} Kekse von <@${msg.author.id}> erhalten.`)
                }
                await resultmsg.edit(embed)
                await delay(45000)
                if(!resultmsg.deleted) resultmsg.delete().catch()
            })
        } else {
            embeds.error(msg, "Fehler", "Du hast keine Kekse.")
        }
    }
}
