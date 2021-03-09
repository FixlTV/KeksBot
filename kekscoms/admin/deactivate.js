const fs = require('fs')
const embeds = require('../../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['deactivate'],
    permissions: 'ADMINISTRATOR',
    description: 'Deaktivert unterschiedliche Add-ons',
    expectedArgs: '[add-on]',
    type: 'admin',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        var type = ''
        if(args[0]) type = args[0].toLowerCase()
        if(!serverdata[msg.guild.id]) {
            embeds.error(msg, 'Fehler', 'Für diesen Server gibt es keine Daten. Somit sind keine Add-ons aktiviert.\nGib `-activate main` ein, um das System zu aktivieren.')
            return
        }
        switch(type)  {
            case 'randomping':
            case 'anyone':
            case '@anyone':
            case '@someone':
                if(!serverdata[msg.guild.id].anyone) {
                    embeds.error(msg, 'Fehler', 'Das `@anyone` Plugin ist nicht aktiv.')
                    return
                }
                delete serverdata[msg.guild.id].anyone
                fs.writeFileSync('../serverdata.json', JSON.stringify(serverdata, null, 2))
                embeds.success(msg, 'Add-On deaktiviert.', 'Das `@anyone` Plugin wurde erfolgreich deaktiviert.\nEs ist nun nicht mehr aktiv.')
                return
            case 'mod':
            case 'moderation':
                if(!serverdata[msg.guild.id].mod) {
                    embeds.error(msg, 'Fehler', 'Das `Moderation` Plugin ist nicht aktiv.')
                    return
                }
                embeds.error(msg, 'Deaktivierung unmöglich.', 'Dieses Add-On lässt sich nicht deaktivieren.')
                return
            default: 
            var anyone = ''
            var mod = ''
            if(serverdata[msg.guild.id]) {
                if(serverdata[msg.guild.id].anyone) anyone = '\nDieses System ist aktuell aktiv.'
                if(serverdata[msg.guild.id].mod) mod = '\nDieses System ist aktuell aktiv.'
            }
            var embed = new discord.MessageEmbed()
                .setColor(color.normal)
                .setTitle('Systemübersicht')
                .setDescription('Hier sind alle Add-Ons aufgelistet. Nutze `<de>activate <Add-On>` um das jeweilige System zu (de)aktivieren.')
                .addField('~~Main~~', 'Die normalen KeksBot Funktionen.\nDie Aktivierung ist nur nötig, wenn die automatische Aktivierung bei Serverbeitritt fehlgeschlagen ist.\n**Dieses System kann NICHT deaktiviert werden!**', true)
                .addField('@anyone', `Das Randomping Add-On.\nWenn eine Nachricht \`@anyone\`, \`@someone\`, oder \`@random\` enthält, wird ein zufälliger Nutzer gepingt.${anyone}`, true)
                .addField('Moderation', `Die KeksBot Moderationsfeatures.\n**Diese Funktion ist aktuell noch in der Alpha Phase und nicht zur allgemeinen Nutzung zugelassen.**${mod}`, true)
                .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
            msg.channel.send(embed).then(msg =>         
                setTimeout(msg => {
                    if(!msg.deleted) {msg.delete()}
                }, 30000, msg)
            )
        }
    }
}