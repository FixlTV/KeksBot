const fs = require('fs').promises
const embeds = require('../../embeds')
const discord = require('discord.js')
const config = require('../../config.json')
const delay = require('delay')

module.exports = async (msg, args, serverdata, color) => {
    let client = msg.client
    if(!args[2]) args[2] = ''
    if(['on', 'an', 'ein'].includes(args[2].toLowerCase())) {
        if(serverdata[msg.guild.id].amconfig.dlinks && serverdata[msg.guild.id].amconfig.dlinks.on) return embeds.error(msg, 'Fehler', 'Die Discord Linkerkennung ist bereits aktiv')
        if(!serverdata[msg.guild.id].amconfig.dlinks) {
            serverdata[msg.guild.id].amconfig.dlinks = {
                on: true,
                invite: 0,
                message: 0,
                upload: 0
            }
        } else serverdata[msg.guild.id].amconfig.dlinks.on = true
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        return embeds.success(msg, 'Discord Linkerkennung aktivert', `Discord Links werden nun automatisch gelöscht.\nVerwende \`${serverdata[msg.guild.id].prefix}settings automod dlinks\`, um das System anzupassen.\n**Achtung**: Die Linkerkennung löscht nur besondere Discord Links wie Invites und Nachrichtenlinks. Um andere Links zu löschen, aktiviere bitte hierfür die Linkerkennung (\`${serverdata[msg.guild.id].prefix}settings automod link\`)`)
    } else if(['off', 'aus'].includes(args[2].toLowerCase())) {
        if(!serverdata[msg.guild.id].amconfig.dlinks) return embeds.error(msg, 'Fehler', 'Die Discord Linkerkennung ist nicht aktiv.')
        serverdata[msg.guild.id].amconfig.dlinks.on = false
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        return embeds.success(msg, 'Linkerkennung deaktiviert', 'Discord Links werden nun nicht mehr gelöscht. Die Einstellungen wurden beibehalten.')
    } else if(['invite', 'i', 'invites'].includes(args[2].toLowerCase())) {
        if(!serverdata[msg.guild.id].amconfig.dlinks) {
            serverdata[msg.guild.id].amconfig.dlinks = {
                on: false,
                invite: 0,
                message: 0,
                upload: 0
            }
        }
        if(!args[3]) args[3] = ''
        await require('./dlinkinvite')(msg, args, serverdata, color)
    } else if(['message', 'msg', 'm', 'messages'].includes(args[2].toLowerCase())) {
        if(!serverdata[msg.guild.id].amconfig.dlinks) {
            serverdata[msg.guild.id].amconfig.dlinks = {
                on: false,
                invite: 0,
                message: 0,
                upload: 0
            }
        }
        if(!args[3]) args[3] = ''
        await require('./dlinkmessage')(msg, args, serverdata, color)
    // } else if(['upload', 'uploads', 'u'].includes(args[2].toLowerCase())) {
    //     if(!serverdata[msg.guild.id].amconfig.dlinks) {
    //         serverdata[msg.guild.id].amconfig.dlinks = {
    //             on: false,
    //             invite: 0,
    //             message: 0,
    //             upload: 0
    //         }
    //     }
    //     if(!args[3]) args[3] = ''
    //     await require('./dlinkupload')(msg, args, serverdata, color)
    } else {
        var dinvite = '(Aktiv)'
        var dupload = '(Aktiv)'
        var dmessage = '(Aktiv)'
        if(!serverdata[msg.guild.id].amconfig.dlinks) {
            dinvite = '(Inaktiv)'
            dupload = dinvite
            dmessage = dinvite    
        } else {
            if(!serverdata[msg.guild.id].amconfig.dlinks.upload) dupload = '(Inaktiv)'
            if(!serverdata[msg.guild.id].amconfig.dlinks.invite) dinvite = '(Inaktiv)'
            if(!serverdata[msg.guild.id].amconfig.dlinks.message) dmessage = '(Inaktiv)'
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle('Discord Linkerkennung')
            .setDescription(`\`${serverdata[msg.guild.id].prefix}settings automod dlinks\`\n\n\`invite\`\nLöscht Einladungen zu anderen Servern. Einladungen zu diesem Server werden ignoriert. ${dinvite}\
\n\`message\`\nLöscht Links zu Nachrichten, die nicht von diesem Server stammen. ${dmessage}`+
//\n\`upload\`\nLöscht Nachrichten mit Links zu Dateien, sodass diese direkt hochgeladen werden müssen. ${dupload}\
`\n\`<option> everywhere\`\nAktiviert die Löschung der ausgewählten Art des Links für alle Nutzer auf dem gesamten Server. Ist diese Option deaktiviert, greifen die gewöhnlichen Linkerkennungseinstellungen (\`${serverdata[msg.guild.id].prefix}settings automod links\`).\n\nModeratoren sind von der Linkerkennung nicht betroffen.`)
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        await delay(30000)
        if(!message.deleted) message.delete().catch()
        return
    }
}