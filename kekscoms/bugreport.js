const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['bugreport', 'bug'],
    type: 'user',
    description: 'Melde Bugs ans Team.\nBitte versuche, den Bug möglichst genau zu beschreiben, damit wir in schnell fixen können.',
    expectedArgs: '<Bug>',
    minArgs: 1,
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        const data = require('../data.json')
        var embed = new discord.MessageEmbed()
            .setAuthor(msg.member.displayName, msg.author.avatarURL())
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} Sende Bug.`)
            .setDescription('Dies kann einige Zeit dauern.')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        msg.delete()
        var message = await msg.channel.send(embed)
        var channel = await client.channels.fetch('780004599787945984')
        var embedx = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`Bugreport #${data.case}`)
            .setDescription(`Bugreport von **${msg.author}** auf **${msg.guild.name}**:\n\`${args.join(' ')}\``)
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        await channel.send(embedx)
        embed.setColor(color.lime)
        embed.setTitle(`Fehler gemeldet!`)
        embed.setDescription(`Dein Bug (#${data.case}) wurde erfolgreich gemeldet.\nVielen Dank!`)
        data.case ++
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 4))
        message.edit(embed).then(msg =>         
            setTimeout(msg => {
                if(!msg.deleted) {msg.delete()}
            }, 7500, msg)
        )
    }
}