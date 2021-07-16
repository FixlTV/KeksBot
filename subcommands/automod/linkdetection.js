const fs = require('fs').promises
const embeds = require('../../embeds')
const discord = require('discord.js')
const config = require('../../config.json')
const delay = require('delay')

module.exports = async (msg, args, serverdata, color) => {
    let client = msg.client
    if(!args[2]) args[2] = ''
    if(['on', 'an', 'ein'].includes(args[2].toLowerCase())) {
        if(serverdata[msg.guild.id].amconfig.links && serverdata[msg.guild.id].amconfig.links.on) return embeds.error(msg, 'Fehler', 'Die Linkerkennung ist bereits aktiv')
        if(!serverdata[msg.guild.id].amconfig.links) {
            serverdata[msg.guild.id].amconfig.links = {
                on: true,
                linkwl: [],
                channelwl: [],
                rolewl: []
            }
        } else serverdata[msg.guild.id].amconfig.links.on = true
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        return embeds.success(msg, 'Linkerkennung aktivert', `Links werden nun automatisch gelöscht.\nVerwende \`${serverdata[msg.guild.id].prefix}settings automod links\`, um das System anzupassen.\n**Achtung**: Die Linkerkennung löscht keine besonderen Discord Links. Aktiviere bitte hierfür das Discord Link Modul (\`${serverdata[msg.guild.id].prefix}settings automod dlink\`)`)
    } else if(['off', 'aus'].includes(args[2].toLowerCase())) {
        if(!serverdata[msg.guild.id].amconfig.links) return embeds.error(msg, 'Fehler', 'Die Linkerkennung ist nicht aktiv.')
        serverdata[msg.guild.id].amconfig.links.on = false
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        return embeds.success(msg, 'Linkerkennung deaktiviert', 'Links werden nun nicht mehr gelöscht. Die Einstellungen wurden beibehalten.')
    } else if(['whitelist', 'wl'].includes(args[2].toLowerCase())) {
        if(!serverdata[msg.guild.id].amconfig.links) {
            serverdata[msg.guild.id].amconfig.links = {
                on: false,
                linkwl: [],
                channelwl: [],
                rolewl: []
            }
        }
        if(!args[3]) args[3] = ''
        await require('./linkwhitelist')(msg, args, msg.guild.id, serverdata, client, color)
    } else if(['role', 'roles', 'r'].includes(args[2].toLowerCase())) {
        if(!serverdata[msg.guild.id].amconfig.links) {
            serverdata[msg.guild.id].amconfig.links = {
                on: false,
                linkwl: [],
                channelwl: [],
                rolewl: []
            }
        }
        if(!args[3]) args[3] = ''
        await require('./linkroles')(msg, args, msg.guild.id, serverdata, client, color)
    } else if(['channel', 'channels', 'c'].includes(args[2].toLowerCase())) {
        if(!serverdata[msg.guild.id].amconfig.links) {
            serverdata[msg.guild.id].amconfig.links = {
                on: false,
                linkwl: [],
                channelwl: [],
                rolewl: []
            }
        }
        if(!args[3]) args[3] = ''
        await require('./linkchannels')(msg, args, msg.guild.id, serverdata, client, color)
    } else {
        var embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle('Linkerkennung')
            .setDescription(`\`${serverdata[msg.guild.id].prefix}settings automod links\`\n\n\`<on || off>\`\nSchalte die Linkerkennung ein oder aus.\n\`whitelist\`\nBearbeite die Liste der erlaubten Links. Diese können immer von jedem Nutzer gesendet werden.\n\`roles\`\nErlaube bestimmten Rollen, auch andere Links zu senden.\n\`channels\`\nErlaube allen Nutzern, in bestimmten Kanälen beliebige Links zu senden.\n\nModeratoren können immer alle Links senden.`)
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        await delay(30000)
        if(!message.deleted) message.delete().catch()
        return
    }
}