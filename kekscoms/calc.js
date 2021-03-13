const math = require('mathjs')
const discord = require('discord.js')
const embeds = require('../embeds')
const delay = require('delay')

module.exports = {
    commands: ['calculate', 'calc', 'rechner', 'rechnen', 'rechne'],
    expectedArgs: '<Rechnung>',
    minArgs: 1,
    description: 'Rechnet Sachen aus.',
    type: 'user',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        var resp
        try {
            resp = math.evaluate(args.join(' '))
        } catch (e) { return embeds.error(msg,'Sysntaxfehler' , `${args.join(' ')}: Da funktioniert was ned`) }
        const embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setAuthor('KeksRechner', 'https://cdn.discordapp.com/attachments/780008420785782784/819559623962656838/KeksRechner.png')
            .addField('Eingabe', `\`\`\`css\n${args.join(' ')}\`\`\``)
            .addField('Ausgabe', `\`\`\`css\n${resp}\`\`\``)
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        
        var message = await msg.channel.send(embed)
        await delay(15000)
        if(!message.deleted) message.delete().catch()
        return
    }
}