const discord = require('discord.js')
const fs = require('fs')
const getcolor = require('../subcommands/getcolor')
const config = require('../config.json')

module.exports = {
    name: 'KeksBox',
    event: 'message',
    async on(msg, client) {
        if(msg.author.bot || msg.author.system || !msg.guild) return
        const serverdata = require('../serverdata.json')
        if(!serverdata[msg.guild.id]) return
        var color = getcolor(msg, serverdata)
        if(!msg.author.bot && !msg.content.startsWith(serverdata[msg.guild.id].prefix) && !serverdata[msg.guild.id].gift) {
            var count = 100
            if(serverdata[msg.guild.id].kbq) count = serverdata[msg.guild.id].kbq
            var x = Math.floor(Math.random() * count)
            if(x == 0) {
                if(serverdata[msg.guild.id].cwl && !serverdata[msg.guild.id].cwl.includes(msg.channel.id)) return
                var y = Math.floor(Math.random() * (4 - 1)) + 1
                if(y == 1) {
                    var embed = new discord.MessageEmbed()
                        .setColor(color.normal)
                        .setTitle('Huch!')
                        .setDescription(`Ein Paket voller Keksen erscheint! Los, Pikachu!\nGib \`${serverdata[msg.guild.id].prefix}claim\` ein, um es einzusammeln.`)
                        .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                } else if(y == 2) {
                    var embed = new discord.MessageEmbed()
                        .setColor(color.normal)
                        .setTitle('Die Lieferung ist da!')
                        .setDescription(`Ein leckeres Kekspaket ist gerade angekommen.\nGib \`${serverdata[msg.guild.id].prefix}claim\` ein, um es einzusammeln.`)
                        .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                } else {
                    var embed = new discord.MessageEmbed()
                        .setColor(color.normal)
                        .setTitle('Legga')
                        .setDescription(`Legga Keeeeeeekseeeeee!\nGib \`${serverdata[msg.guild.id].prefix}claim\` ein, um es einzusammeln.`)
                        .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                }
                var message = await msg.channel.send(embed)
                serverdata[msg.guild.id].gift = message.id
                fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
            }
        }
    
    }
}