const discord = require('discord.js')
const delay = require('delay')
const config = require('../../config.json')
const embeds = require('../../embeds')
const fs = require('fs').promises

module.exports = async (msg, args, serverdata, color) => {
    var client = msg.client
    if(args[3].toLowerCase() === 'everywhere') {
        if(serverdata[msg.guild.id].amconfig.dlinks.message == 1) {
            serverdata[msg.guild.id].amconfig.dlinks.message = 2
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Nachrichtenlinks werden nun unabhängig von Nutzer, Kanal und Rollen gelöscht.')
        } else if(serverdata[msg.guild.id].amconfig.dlinks.message == 2) {
            serverdata[msg.guild.id].amconfig.dlinks.message = 1
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Nachrichtenlinks werden jetzt nach den vorgegebenen Parametern gelöscht.')
        } else {
            serverdata[msg.guild.id].amconfig.dlinks.message = 2
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Nachrichtenlinks werden nun immer gelöscht.\nDies betrifft keine Moderatoren.')
        }
    } else {
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle('Nachrichtenlinks (Inaktiv)')
            .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Nachrichtenlinks einzuschalten.')
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 30 Sekunden aus.`, client.user.avatarURL())
        if(serverdata[msg.guild.id].amconfig.dlinks.message) {
            embed.setColor(color.lime)
                .setTitle('Nachrichtenlinks (Aktiv)')
                .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Nachrichtenlinks auszuschalten')
        }
        var message = await msg.channel.send(embed)
        let filter = (r, u) => r.emoji.id == '865524573767729162' && u.id === msg.author.id
        let collector = message.createReactionCollector(filter, { time: 30000 })

        collector.on('collect', async (r) => {
            if(r.users.cache.has(msg.author.id)) r.users.remove(msg.author).catch()
            if(!serverdata[msg.guild.id].amconfig.dlinks.message) {
                embed.setColor(color.lime)
                    .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Nachrichtenlinks auszuschalten')
                    .setTitle('Nachrichtenlinks (Aktiv)')
                serverdata[msg.guild.id].amconfig.dlinks.message = 1
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                await message.edit(embed)
            } else {
                embed.setColor(color.red)
                    .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Nachrichtenlinks einzuschalten')
                    .setTitle('Nachrichtenlinks (Inaktiv)')
                serverdata[msg.guild.id].amconfig.dlinks.message = 0
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                await message.edit(embed)
            }
        })

        collector.on('end', async () => {
            if(message.deleted) return
            if(!message.deleted) message.reactions.removeAll().catch()
            if(serverdata[msg.guild.id].amconfig.dlinks.message == 1) embed.setDescription('Nachrichtenlinks werden gelöscht.').setColor(color.lime).setTitle('Nachrichtenlinks (Aktiv)')
            else if(serverdata[msg.guild.id].amconfig.dlinks.message == 2) embed.setDescription('Nachrichtenlinks werden unabhängig von Nutzer und Kanal gelöscht.').setColor(color.lime).setTitle('Nachrichtenlinks (Aktiv)')
            else embed.setDescription('Nachrichtenlinks werden nicht gelöscht').setColor(color.red).setTitle('Nachrichtenlinks (Inaktiv)')
            embed.setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
            if(!message.deleted) await message.edit(embed)
            await delay(10000)
            if(!message.deleted) message.delete().catch()
        })
        
        message.react('<:toggle:865524573767729162>').catch()
    }
}