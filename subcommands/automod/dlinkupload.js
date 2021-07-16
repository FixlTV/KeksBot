const discord = require('discord.js')
const delay = require('delay')
const config = require('../../config.json')
const embeds = require('../../embeds')
const fs = require('fs').promises

module.exports = async (msg, args, serverdata, color) => {
    var client = msg.client
    if(args[3].toLowerCase() === 'everywhere') {
        if(serverdata[msg.guild.id].amconfig.dlinks.upload == 1) {
            serverdata[msg.guild.id].amconfig.dlinks.upload = 2
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Uploads werden nun unabhängig von Nutzer, Kanal und Rollen gelöscht, wenn sie als Link getilt wurden.')
        } else if(serverdata[msg.guild.id].amconfig.dlinks.upload == 2) {
            serverdata[msg.guild.id].amconfig.dlinks.upload = 1
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Uploads werden jetzt nach den vorgegebenen Parametern gelöscht.')
        } else {
            serverdata[msg.guild.id].amconfig.dlinks.upload = 2
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Uploads werden nun immer, wenn sie über einen Link geteilt werden, gelöscht.\nDies betrifft keine Moderatoren.')
        }
    } else {
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle('Uploads (Inaktiv)')
            .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Uploads einzuschalten.\nDiese Funktion gilt nur für Dateien, die über einen Discord Link geteilt wurden.')
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 30 Sekunden aus.`, client.user.avatarURL())
        if(serverdata[msg.guild.id].amconfig.dlinks.upload) {
            embed.setColor(color.lime)
                .setTitle('Uploads (Aktiv)')
                .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Uploads auszuschalten')
        }
        var message = await msg.channel.send(embed)
        let filter = (r, u) => r.emoji.id == '865524573767729162' && u.id === msg.author.id
        let collector = message.createReactionCollector(filter, { time: 30000 })

        collector.on('collect', async (r) => {
            if(r.users.cache.has(msg.author.id)) r.users.remove(msg.author).catch()
            if(!serverdata[msg.guild.id].amconfig.dlinks.upload) {
                embed.setColor(color.lime)
                    .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Uploads auszuschalten')
                    .setTitle('Uploads (Aktiv)')
                serverdata[msg.guild.id].amconfig.dlinks.upload = 1
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                await message.edit(embed)
            } else {
                embed.setColor(color.red)
                    .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Uploads einzuschalten')
                    .setTitle('Uploads (Inaktiv)')
                serverdata[msg.guild.id].amconfig.dlinks.upload = 0
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                await message.edit(embed)
            }
        })

        collector.on('end', async () => {
            if(message.deleted) return
            if(!message.deleted) message.reactions.removeAll().catch()
            if(serverdata[msg.guild.id].amconfig.dlinks.upload == 1) embed.setDescription('Uploads werden gelöscht.').setColor(color.lime).setTitle('Uploads (Aktiv)')
            else if(serverdata[msg.guild.id].amconfig.dlinks.upload == 2) embed.setDescription('Uploads werden unabhängig von Nutzer und Kanal gelöscht.').setColor(color.lime).setTitle('Uploads (Aktiv)')
            else embed.setDescription('Uploads werden nicht gelöscht').setColor(color.red).setTitle('Uploads (Inaktiv)')
            embed.setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            if(!message.deleted) await message.edit(embed)
            await delay(10000)
            if(!message.deleted) message.delete().catch()
        })

        message.react('<:toggle:865524573767729162>').catch()
    }
}