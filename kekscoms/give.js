const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: 'give',
    expectedArgs: '<@Nutzer> <Zahl> [Begründung]',
    minArgs: 2,
    permission: '',
    modonly: 1,
    description: 'Gibt jemandem Kekse',
    type: 'unlisted',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        var count = args[1]
        var user
        if(args[2]) {
            var reason = [...args]
            reason.shift()
            reason.shift()
        }
        msg.delete()
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
            embeds.error(msg, 'Syntaxfehler', `Bitte gib einen Nutzer an:\n${serverdata[msg.guild.id].prefix}give **<@Nutzer \|\| Nutzername \|\| Nickname>** <Zahl> [Begründung]`)
            return
        }
        if(isNaN(count)) {
            embeds.error(msg, 'Syntaxfehler', `Bitte gib eine Zahl an:\n${serverdata[msg.guild.id].prefix}gift <@Nutzer> **<Zahl>** [Begründung]`)
            return
        }
        count = Number(count)
        if(user.id == msg.author.id) {
            embeds.error(msg, 'Ne Ne Ne', 'Du kannst dir selbst keine Kekse geben ._.\n**#CHEATAH**')
            return
        }
        user = user.user
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
        id = user.id
        userdata[id].cookies = Number(userdata[id].cookies) + count
        if(userdata[id].cookies < 0) userdata[id].cookies = 0
        fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
        var embed = new discord.MessageEmbed()
            .setColor(color.lime)
            .setTitle(`${emotes.accept} Kontodaten überschrieben.`)
            .setDescription(`Der Kontostand von **${user.username}**#${user.discriminator} wurde erfolgreich geändert.`)
            .addField('Neuer Kontostand', userdata[id].cookies, true)
        if(count > 0) {
            embed.addField('Hinzugefügt', count, true)
        } else if(count < 0) {
            embed.addField('Entfernt', Math.abs(count), true)
        }
        if(reason) {
            embed.addField('Begründung', reason.join(' '), true)
        }
        embed.setAuthor(msg.author.tag, msg.author.avatarURL())
        var channel = await client.channels.fetch('801406480309289002')
        channel.send(embed)
        embeds.success(msg, 'Kontostand geändert', `Der Kontostand von ${user} wurde erfolgreich geändert.\nFür mehr Informationen besuche <#801406480309289002>.`)
    }
}