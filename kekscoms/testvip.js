const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['testvip', 'checkvip', 'viptest', 'testvip'],
    expectedArgs: '<User ID>',
    minArgs: 1,
    maxArgs: 1,
    modonly: 1,
    description: 'Überprüft, ob der Nutzer VIP ist.',
    type: 'unlisted',
    callback: (msg, args, client, serverdata, userdata, config, color) => {
        if(!isNaN(args)) { 
            const VIPs = require('../VIP.json')
            msg.delete()
            if(args in VIPs) {
                if(VIPs[args] == 1) {
                    embeds.success(msg, "Test erfolgreich", `<@${args}> ist VIP.`)
                } else {
                    embeds.error(msg, "Test fehlgeschlagen", `<@${args}> ist kein VIP.`)
                }
            } else {
                embeds.error(msg, "Test fehlgeschlagen", `<@${args}> ist kein VIP.`)
            }
        } else {
            msg.delete()
            embeds.error(msg, "Fehler", `\`${args.join(' ')}\` ist keine gültige ID.`)
        }
    }
}
