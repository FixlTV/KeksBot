const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['giftdm', 'dmongift', 'gdm'],
    expectedArgs: '<on | off>',
    minArgs: 1,
    maxArgs: 1,
    description: 'Bestimmt, ob man bei Geschenken via DM benachrichtigt wird.',
    type: 'user',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        var arg = msg.content.split(' ')[1]
        if(arg == 'on' || arg == 'activate' || arg == 'an' || arg == 'ein') {
        if(userdata[msg.author.id]) {
                if(userdata[msg.author.id].giftdm == 1) {
                    embeds.error(msg, "Fehler", "Du hast die Geschenk-Benachrichtigungen bereits aktiviert.")
                } else {
                    userdata[msg.author.id].giftdm = 1
                    fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
                    embeds.success(msg, "Umstellung erfolgreich!", "Du erhältst nun Geschenk-Benachrichtigungen per DM.\nBitte sorge dafür, dass ich dir DMs senden kann.")
                }
            } else {
                embeds.error(msg, "Fehler", "Für dich wurden noch keine Daten angelegt.\nGib ``-badges`` ein, um dies zu tun.")
            }
        } else {
            if(arg == 'off' || arg == 'deactivate' || arg == 'aus') {
                if(userdata[msg.author.id]) {
                    if(userdata[msg.author.id].giftdm == 1) {
                        userdata[msg.author.id].giftdm = 0
                        fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
                        embeds.success(msg, "Umstellung erfolgreich!", "Du erhältst nun keine Geschenk-Benachrichtigungen mehr per DM.")
                    } else {
                        embeds.error(msg, "Fehler", "Du hast die Geschenk-Benachrichtigungen bereits deaktiviert.")
                    }
                } else {
                    embeds.error(msg, "Fehler", "Für dich wurden noch keine Daten angelegt.\nGib ``-badges`` ein, um dies zu tun.")
                }
            } else {
                embeds.error(msg, "Syntaxfehler", `\`giftdm <on | off>\``)
            }
        }
    }
}
