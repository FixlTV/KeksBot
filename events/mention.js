const config = require('../config.json')
const getColor = require('../subcommands/getcolor')

module.exports = {
    name: 'Mention',
    event: 'message',
    async on(msg, client) {
        const serverdata = require('../serverdata.json')
        const color = getColor(msg, serverdata)
        if(msg.author.bot == false && msg.system && (msg.content == '<@!774885703929561089>' || msg.content === '<@774885703929561089>')) {
            var embed = new discord.MessageEmbed()
                .setColor(color.normal)
            if(serverdata[msg.guild.id]) {
                embed.setDescription(`Mein Prefix ist: **${serverdata[msg.guild.id].prefix}**`)
            } else {
                embed.setDescription(`Mein Prefix ist: **${config.prefix}**`)
            }
            var message = await msg.channel.send(embed)
            await delay(5000)
            if(!message.deleted) message.delete().catch()
        }
    }
}