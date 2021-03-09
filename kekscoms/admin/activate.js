const fs = require('fs')
const embeds = require('../../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['activate'],
    permissions: 'ADMINISTRATOR',
    description: 'Aktivert unterschiedliche Add-ons',
    expectedArgs: '[add-on]',
    type: 'admin',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        if(!args[0]) args.push('')
        type = args[0].toLowerCase()
        if(type == 'cookies' || type == 'kekse' || type == 'main') {
            if(serverdata[msg.guild.id]) {
                embeds.error(msg, "Aktivierung unmöglich", "Das KeksSystem ist bereits aktiv.")
            } else {
                try {
                    serverdata[msg.guild.id] = {}
                    serverdata[msg.guild.id].thismin = 0
                    serverdata[msg.guild.id].lv = 1
                    serverdata[msg.guild.id].xp = 0
                    serverdata[msg.guild.id].prefix = "-"
                    fs.writeFileSync('../serverdata.json',JSON.stringify(serverdata, null, 2))
                    embeds.success(msg, 'System aktiviert!', 'Das **KeksSystem** wurde erfolgreich aktiviert.')
                } catch (err) {
                    embeds.error(msg,'Fehler',err,"\nBitte wende dich an ein Teammitglied, um dieses Problem zu melden.")
                }}
            } else if(type == 'randomping' || type == 'anyone' || type == '@anyone' || type == '@someone') {
                if(serverdata[msg.guild.id]) {
                    if(serverdata[msg.guild.id].anyone) {
                        embeds.error(msg, "Aktivierung unmöglich", "Das Add-on **KeksBot Randomping** ist bereits aktiv.")
                    } else {
                        serverdata[msg.guild.id].anyone = 1
                        fs.writeFileSync('../serverdata.json', JSON.stringify(serverdata, null, 2))
                        embeds.success(msg, "System aktiviert!", "Das **KeksBot Randomping** Add-On wurde erfolgreich aktiviert.")
                    }
                } else {
                    embeds.error(msg, "Aktivierung unmöglich", "Das KeksSystem ist auf diesem Server noch nicht aktiv.\nBitte verwende zunächst `-activate main`, um es zu starten.")
                }
            } else {
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
                    .addField('Main', 'Die normalen KeksBot Funktionen.\nDie Aktivierung ist nur nötig, wenn die automatische Aktivierung bei Serverbeitritt fehlgeschlagen ist.', true)
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
