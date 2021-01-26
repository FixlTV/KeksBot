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
            result = await eval(args.join(' '))
            var embed = new discord.MessageEmbed()
                .setColor(0xf1c40f)
                .setTitle('Eval erfolgreich')
                .addField(':inbox_tray: Input', `\`\`\`${args.join(' ')}\`\`\``)
                .addField(':outbox_tray: Output', result)
            msg.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }))
        } catch(err) {
            embeds.error(msg, "Fehler", `\`\`\`${err}\`\`\``)
        }
    }
}
