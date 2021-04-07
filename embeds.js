const discord = require('discord.js')
const emotes = require('./emotes.json')
const config = require('./config.json')
const delay = require('delay')
const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}

module.exports = {
    /**
     * 
     * @param {discord.Message} msg 
     * @param {String} title 
     * @param {String} text 
     * @param {boolean} edit 
     * @param {boolean} keep 
     * @returns discord.Message
     */
    async error(msg, title, text, edit, keep) {
        var embed = new discord.MessageEmbed()
            .setFooter(msg.author.tag, msg.author.avatarURL({dynamic: true}))
            .setColor(color.red)
            .setTitle(`${emotes.denied} ${title}`)
            .setDescription(text)
        if(!edit) {
            embed.setFooter(msg.author.tag, msg.author.avatarURL({dynamic: true}))
            var message = await msg.channel.send(embed)
        }
        else var message = await msg.edit(embed).catch()
        await delay(7500)
        if(!keep && message.deletable) message.delete().catch()
        return Promise.resolve(message)
    },
    /**
     * 
     * @param {discord.Message} msg 
     * @param {discord.PermissionString} permission 
     * @param {boolean} edit 
     * @param {boolean} keep 
     * @returns discord.Message
     */
    async needperms(msg, permission, edit, keep) {
        var embed = new discord.MessageEmbed()
            .setFooter(msg.author.tag, msg.author.avatarURL({dynamic: true}))
            .setColor(color.red)
            .setTitle(`${emotes.denied} Zugriff verweigert!`)
            .setDescription(`Um diesen Befehl auszuführen, benötigst du \`\`${permission}\`\`.`)
        if(!edit) {
            embed.setFooter(msg.author.tag, msg.author.avatarURL({dynamic: true}))
            var message = await msg.channel.send(embed)
        }
        else var message = await msg.edit(embed).catch()
        await delay(7500)
        if(!keep && message.deletable) message.delete().catch()
        return Promise.resolve(message)
    },
    /**
     * 
     * @param {discord.Message} msg 
     * @param {String} title 
     * @param {String} text 
     * @param {boolean} edit 
     * @param {boolean} keep 
     * @returns discord.Message
     */
    async success(msg, title, text, edit, keep) {
        var embed = new discord.MessageEmbed()
            .setColor(color.lime)
            .setTitle(`${emotes.accept} ${title}`)
            .setDescription(text)
        if(!edit) {
            embed.setFooter(msg.author.tag, msg.author.avatarURL({dynamic: true}))
            var message = await msg.channel.send(embed)
        }
        else var message = await msg.edit(embed).catch()
        await delay(7500)
        if(!keep && message.deletable) message.delete().catch()
        return Promise.resolve(message)
    },
    /**
     * 
     * @param {discord.Message} msg 
     * @param {String} syntax 
     * @param {boolean} edit 
     * @param {boolean} keep 
     * @returns discord.Message
     */
    async syntaxerror(msg, syntax, edit, keep) {
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle(`${emotes.denied} Syntaxfehler`)
            .setDescription(`Bitte verwende diese Syntax:\n\`${syntax}\``)
        if(!edit) {
            embed.setFooter(msg.author.tag, msg.author.avatarURL({dynamic: true}))
            var message = await msg.channel.send(embed)
        }
        else var message = await msg.edit(embed).catch()
        await delay(7500)
        if(!keep && message.deletable) message.delete().catch()
        return Promise.resolve(message)
    }
}