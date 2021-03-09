const discord = require('discord.js')
const delay = require('delay')
const fs = require('fs').promises
const embeds = require('../embeds')
const emotes = require('../emotes.json')
const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}
const config = require('../config.json')

module.exports = async (msg, args, client, serverdata) => {
    var text = new String(msg.content)
    if(!args[1]) return
    while(!text.startsWith(args[1])) {
        text = text.substring(1)
    }
    text = text.trimStart()
    if(text.length > 5) return embeds.error(msg, 'Prefix zu lang', `\`${text}\` ist ein bisschen zu lang. Bitte verwende maximal 5 Zeichen.`)
    serverdata[msg.guild.id].prefix = text
    await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
    return embeds.success(msg, 'Prefix geändert!', `Der Prefix ist nun \`${text}\`.`)
}