const discord = require('discord.js')

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
            .setTitle(title)
            .setDescription(text)
        msg.channel.send('',embed).then(msg => msg.delete({ timeout: 3000 })).then((msg) => {
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
        msg.channel.send('',embed).then(msg => msg.delete({ timeout: 3000 })).then((msg) => {
            message = msg
        })
        return Promise.resolve(message)
    },
    success(msg, title, text) {
        var message
        var embed = new discord.MessageEmbed()
            .setColor(color.lime)
            .setTitle(title)
            .setDescription(text)
        msg.channel.send('',embed).then(msg => msg.delete({ timeout: 3000 })).then((msg) => {
            message = msg
        })
        return Promise.resolve(message)
    }
}