const { MessageEmbed } = require('discord.js')
const delay = require('delay')

module.exports = {
    type: 'info',
    description: 'Zeigt tolle Links an.',
    commands: ['links', 'invite', 'support', 'github'],
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color, embeds) => {
        msg.delete()
        var embed = new MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} KeksBot Links`)
            .setDescription('📡 [Bot einladen](https://discord.com/api/oauth2/authorize?client_id=774885703929561089&permissions=8&scope=applications.commands%20bot)\n📣 [Support Server](https://discord.gg/g8AkYzWRCK)\n🌐 [GitHub](https://www.github.com/FixlTV/KeksBot)')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        await delay(30000)
        if(!message.deleted) message.delete()
    }
}