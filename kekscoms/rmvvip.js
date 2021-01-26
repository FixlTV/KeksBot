const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['removevip', 'rmvvip', 'vipremove', 'viprmv'],
    expectedArgs: '<User ID>',
    minArgs: 1,
    maxArgs: 1,
    modonly: 1,
    description: 'Entzieht einem Nutzer den VIP Status.',
    type: 'unlisted',
    callback: (msg, args, client, serverdata, userdata, config, color) => {
        if(!isNaN(args)) { 
            const VIPs = require('../VIP.json')
            delete VIPs[args]
            fs.writeFileSync('./VIP.json',JSON.stringify(VIPs, null, 2))
            msg.delete()
            embeds.success(msg, 'Daten gespeichert!', `<@${args}> ist kein VIP mehr.`)
            console.log(`${msg.author.username}: ${args} ist kein VIP mehr.`)
            try {
                client.guilds.fetch('775001585541185546').then(guild => {
                    try {
                        client.users.fetch(args).then(user => {
                        guild.members.fetch(user).then(member => {
                            let role = guild.roles.cache.find(r => r.name === 'VIP')
                            member.roles.remove(role)
                        })})
                    } catch (err) {
                        console.log(err)
                    }
                })
            } catch (err) {console.log(err)}
        } else {
            msg.delete()
            embeds.error(msg, "Fehler", `\`${args.join(' ')}\` ist keine gültige ID.`)
        }
    }
}