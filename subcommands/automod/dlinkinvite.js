const discord = require('discord.js')
const delay = require('delay')
const config = require('../../config.json')
const embeds = require('../../embeds')
const fs = require('fs').promises

module.exports = async (msg, args, serverdata, color) => {
    if(args[3].toLowerCase() === 'everywhere') {
        if(serverdata[msg.guild.id].amconfig.dlinks.invite == 1) {
            serverdata[msg.guild.id].amconfig.dlinks.invite = 2
            await fs.writeFile('serverdata.json', JSON.stringify(serverdatam, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Discord Einladungen werden nun unabhängig von Nutzer, Kanal und Rollen gelöscht.')
        } else if(serverdata[msg.guild.id].amconfig.dlinks.invite == 2) {
            serverdata[msg.guild.id].amconfig.dlinks.invite = 1
            await fs.writeFile('serverdata.json', JSON.stringify(serverdatam, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Discord Einladungen werden jetzt nach den vorgegebenen Parametern gelöscht.')
        } else {
            serverdata[msg.guild.id].amconfig.dlinks.invite = 2
            await fs.writeFile('serverdata.json', JSON.stringify(serverdatam, null, 2))
            return await embeds.success(msg, 'Änderungen gespeichert', 'Einladungen zu Discord Servern werden nun immer gelöscht.\nDies betrifft keine Moderatoren.')
        }
    } else {
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle('Discord Einladungen (Inaktiv)')
            .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Discord Invite Links einzuschalten')
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 30 Sekunden aus.`, client.user.avatarURL())
        if(serverdata[msg.guild.id].amconfig.dlinks.invite) {
            embed.setColor(color.lime)
                .setTitle('Discord Einladungen (Aktiv)')
                .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Discord Invite Links auszuschalten')
        }
        var message = await msg.channel.send(embed)
        let filter = (r, u) => r.emoji.id == '865524573767729162' && u.id === msg.author.id
        let collector = message.createReactionCollector(filter, { time: 30000 })

        collector.on('collect', async (r) => {
            if(r.users.cache.has(msg.author.id)) r.users.remove(msg.author).catch()
            if(!serverdata[msg.guild.id].amconfig.dlinks.invite) {
                embed.setColor(color.lime)
                    .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Discord Invite Links auszuschalten')
                    .setTitle('Discord Einladungen (Aktiv)')
                serverdata[msg.guild.id].amconfig.dlinks.invite = 1
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                await message.edit(embed)
            } else {
                embed.setColor(color.red)
                    .setDescription('Reagiere auf diese Nachricht, um die Erkennung von Discord Invite Links einzuschalten')
                    .setTitle('Discord Einladungen (Inaktiv)')
                serverdata[msg.guild.id].amconfig.dlinks.invite = 0
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                await message.edit(embed)
            }
        })

        collector.on('end', async () => {
            if(!message.deleted) message.reactions.removeAll().catch()
            await delay(10000)
            if(!message.deleted) message.delete().catch()
        })

        message.react('<:toggle:865524573767729162>').catch()
    }
}