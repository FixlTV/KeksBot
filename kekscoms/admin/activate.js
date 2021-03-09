const fs = require('fs')
const embeds = require('../../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['activate'],
    permission: 'ADMINISTRATOR',
    description: 'Aktivert unterschiedliche Add-ons',
    expectedArgs: '[add-on]',
    type: 'admin',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        type = msg.content.split(' ')[1]
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
                    fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
                    embeds.success(msg, 'System aktiviert!', 'Das **KeksSystem** wurde erfolgreich aktiviert.')
                } catch (err) {
                    embeds.error(msg,'Fehler',err,"\nBitte wende dich an ein Teammitglied, um dieses Problem zu melden.")
                }}
            } else {
                if(type == 'randomping' || type == 'anyone' || type == '@anyone' || type == '@someone') {
                    if(serverdata[msg.guild.id]) {
                        if(serverdata[msg.guild.id].anyone) {
                            embeds.error(msg, "Aktivierung unmöglich", "Das Add-on **KeksBot Randomping** ist bereits aktiv.")
                        } else {
                            serverdata[msg.guild.id].anyone = 1
                            fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                            embeds.success(msg, "System aktiviert!", "Das **KeksBot Randomping** Add-on wurde erfolgreich aktiviert.")
                        }
                    } else {
                        embeds.error(msg, "Aktivierung unmöglich", "Das KeksSystem ist auf diesem Server noch nicht aktiv.\nBitte verwende zunächst `activate main`, um es zu starten.")
                    }
                } else {
                    var embed = new discord.MessageEmbed()
                        .setColor(color.yellow)
                        .setTitle('Systemübersicht')
                        .setDescription('Hier sind alle Befehle, mit denen sich die KeksBot Add-ons aktivieren lassen.')
                        .addField('KeksBot Main', '`activate main`\nAktiviert die Standart KeksBot Funktionen. Ohne die geht gar nichts.')
                        .addField('KeksBot Randompings', '`activate randomping`\nAktiviert das Randomping Add-on.\nAus Performancegründen ist diese Funktion aktuell ausschließlich für Partner.\nBei einem @anyone in einer Nachricht, wird ein zufälliges Mitglied des Servers gepingt.')
                        .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                    msg.channel.send(embed).then(msg => msg.delete({ timeout: 30000 }))
                }
            }
    }
}
