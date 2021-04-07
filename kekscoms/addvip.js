const fs = require('fs').promises
const embeds = require('../embeds')
const discord = require('discord.js')
const searchmember = require('../subcommands/searchmembers')

module.exports = {
    commands: ['addvip', 'vipadd'],
    expectedArgs: '<@Nutzer>',
    minArgs: 1,
    permission: '',
    modonly: 1,
    description: 'Macht jemanden zum VIP',
    type: 'unlisted',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete().catch()
        var VIP = require('../VIP.json')
        var embed = new discord.MessageEmbed()
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} Anfrage wird verarbeitet`)
            .setDescription('Dies kann einige Zeit dauern.')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        var result = await searchmember(msg, args, args.join(' '))
        if(!result[0]) return embeds.error(message, 'Fehler', 'Es wurde kein Nutzer gefunden.\nBitte stelle sicher, dass er auf diesem Server ist.', true)
        member = result[0][0]
        if(VIP[member.id]) {
            return embeds.error(message, 'Fehler', `**${member.user.tag}** ist schon VIP.`, true, false)
        }
        VIP[member.id] = 1
        await fs.writeFile('VIP.json', JSON.stringify(VIP, null, 4))
        var guild = await client.guilds.fetch('775001585541185546')
        if(guild.members.cache.has(member.id)) {
            let guildmember = guild.member(member.user)
            let role = guild.roles.cache.find(r => r.name === 'VIP')
            await guildmember.roles.add(role).catch()
        }
        return embeds.success(message, 'Daten geändert', `**${member.user.tag}** ist jetzt VIP. Yaaaayyy`, true, false)
    }
}