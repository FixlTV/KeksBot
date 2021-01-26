const discord = require('discord.js')
const emotes = require('./emotes.json')
const config = require('./config.json')
const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}

module.exports = {
    error(msg, title, text) {
        var message
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle(`${emotes.denied} ${title}`)
            .setDescription(text)
        msg.channel.send('',embed).then(msg => msg.delete({ timeout: 7500 })).then((msg) => {
            message = msg
        })
        return Promise.resolve(message)
    },
    needperms(msg, permission) {
        var message
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle(':x: Zugriff verweigert!')
            .setDescription(`Um diesen Befehl auszuführen, benötigst du \`\`${permission}\`\`.`)
        msg.channel.send('',embed).then(msg => msg.delete({ timeout: 7500 })).then((msg) => {
            message = msg
        })
        return Promise.resolve(message)
    },
    success(msg, title, text) {
        var message
        var embed = new discord.MessageEmbed()
            .setColor(color.lime)
            .setTitle(`${emotes.accept} ${title}`)
            .setDescription(text)
        msg.channel.send('',embed).then(msg => msg.delete({ timeout: 7500 })).then((msg) => {
            message = msg
        })
        return Promise.resolve(message)
    },
    cookie(msg, args, data) {
        var message
        var embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} Kekse ausgeliefert.`)
            .setDescription(`${args} Kekse wurden in deinem Lager zwischengespeichert.\nDu hast aktuell ${data} Kekse.`)
            .setFooter(`© KeksBot ${config.version}`, msg.author.avatarURL())
        msg.channel.send('',embed).then(msg => msg.delete({ timeout: 7500 })).then((msg) => {
            message = msg
        })
        return Promise.resolve(message)
    },
    syntaxerror(msg, syntax) {
        const serverdata = require('./serverdata.json')
        var message
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle(`${emotes.denied} Syntaxfehler`)
            .setDescription(`Bitte verwende diese Syntax:\n\`${syntax}\``)
        msg.channel.send(embed).then(msg => msg.delete({ timeout: 7500 })).then(msg => {
            message = msg
        })
        return Promise.resolve(message)
    }
}