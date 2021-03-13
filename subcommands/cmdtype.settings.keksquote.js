const discord = require('discord.js')
const embeds = require('../embeds')
const emotes = require('../emotes.json')
const fs = require('fs').promises
const delay = require('delay')
const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}
const config = require('../config.json')

module.exports = async (msg, args, client, serverdata) => {
    msg.delete()
    if(args[0]) {
        if(args[0].toLowerCase() === 'reset') {
            if(serverdata[msg.guild.id].kbq) delete serverdata[msg.guild.id].kbq
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            embeds.success(msg, `KeksBox Spawnrate zurückgesetzt`, 'Die Spawnrate liegt nun wieder bei 1%.')
            return
        } else if(!isNaN(args[0])) {
            if(args[0] < 20 || args[0] > 10000) return embeds.error(msg, 'Zahl außerhalb des Geltungsbereich', 
            'Bitte gib eine Zahl zwischen 20 und 10000 an.\n\
            Dies definiert die ungefähre Nachrichtenanzahl zwischen den KeksBoxen.')
            
        }
    } else {

    }
}