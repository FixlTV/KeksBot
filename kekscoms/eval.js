const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['eval'],
    expectedArgs: '<Code>',
    minArgs: 1,
    modonly: 1,
    type: 'unlisted',
    callback: async (msg, args, client, serverdata, userdata, config, color) => {
        msg.delete()
        try {
            var commands = args.join(' ').replace('(', ' ').replace(')', ' ').replace('{', ' ').replace('}', ' ').replace('[', ' ').replace(']', ' ').split(' ')
            if (commands.includes('config.token')) {
                embeds.error(msg, 'WARNUNG!', 'Es besteht die Möglichkeit, dass du gerade versucht hast, den Token zu leaken.\nDein Eval wurde daher abgebrochen.')
                return
            }
            result = await eval(args.join(' '))
            var embed = new discord.MessageEmbed()
                .setColor(0xf1c40f)
                .setTitle('Eval erfolgreich')
                .addField(':inbox_tray: Input', `\`\`\`${args.join(' ')}\`\`\``)
                .addField(':outbox_tray: Output', result)
            msg.channel.send(embed).then(msg =>         
                setTimeout(msg => {
                    if(!msg.deleted) {msg.delete()}
                }, 10000, msg)
            )
        } catch(err) {
            embeds.error(msg, "Fehler", `\`\`\`${err}\`\`\``)
        }
    }
}
