const fs = require('fs')
const embeds = require('../../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['request'],
    type: 'user',
    description: 'Wünsch dir was.\nAm besten eine neue Funktion für den Bot.',
    expectedArgs: '<Wunsch>',
    minArgs: 1,
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        const data = require('../../data.json')
        var embed = new discord.MessageEmbed()
            .setAuthor(msg.member.displayName, msg.author.avatarURL())
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} Sende Anfrage.`)
            .setDescription('Dies kann einige Zeit dauern.')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        msg.delete()
        var message = await msg.channel.send(embed)
        var channel = await client.channels.fetch('780004713038872596')
        var embedx = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`Wunsch #${data.request}`)
            .setDescription(`Von **${msg.author}** auf **${msg.guild.name}**:\n\`${args.join(' ')}\``)
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        await channel.send(embedx)
        embed.setColor(color.lime)
        embed.setTitle(`Yaaaaaaaaaaaaaaay`)
        embed.setDescription(`Dein Wunsch (#${data.request}) wurde erfolgreich gesendet.\nVielen Dank!`)
        data.request ++
        fs.writeFileSync('data.json', JSON.stringify(data, null, 4))
        message.edit(embed).then(msg =>         
            setTimeout(msg => {
                if(!msg.deleted) {msg.delete()}
            }, 7500, msg)
        )
    }
}