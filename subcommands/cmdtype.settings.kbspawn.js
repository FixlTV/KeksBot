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
    var count
    if(args[0]) count = args[0].replace(',', '.')
    if(count) {
        if(count.toLowerCase() === 'reset') {
            if(serverdata[msg.guild.id].kbq) delete serverdata[msg.guild.id].kbq
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            embeds.success(msg, `KeksBox Spawnrate zurückgesetzt`, 'Die Spawnrate liegt nun wieder bei 1%.')
            return
        } else if(!isNaN(count)) {
            count = Number(count)
            count = count.round()
            if(count < 20 || count > 10000) return embeds.error(msg, 'Fehler', 
            'Bitte gib eine Zahl zwischen 20 und 10000 an.\n\
Dies definiert die ungefähre Nachrichtenanzahl zwischen den KeksBoxen.')
            serverdata[msg.guild.id].kbq = Number(count)
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            var percentage = 1/Number(count)*100
            return embeds.success(msg, 'Rate geändert', `Die KeksBox Spawnrate wurde auf ${percentage}% (ungefähr eine KeksBox pro ${count} Nachrichten) gesetzt.`)
        } else if(count.endsWith('%')) {
            if(isNaN(count.replace('%', null))) return embeds.error(msg, 'Syntaxfehler', `${count.replace('%', null)} ist keine gültige Prozentzahl.`)
            count = Number(count.replace('%', null))
            var number = 100/count
            if(number > 20 || number < 10000) return embeds.error(msg, 'Fehler', 
            'Bitte gib einen Wert zwischen 5% und 0,01% an\n\
Dies definiert die Spawnwahrscheinlichkeit von KeksBoxen.')
            serverdata[msg.guild.id].kbq = number
            await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
            return embeds.success(msg, 'Rate geändert', `Die KeksBox Spawnrate wurde auf ${count}% (ungefähr eine KeksBox pro ${number} Nachrichten) gesetzt.`)
        }
    }
    var current = 100
    if(serverdata[msg.guild.id].kbq) current = Number(serverdata[msg.guild.id].kbq)
    var p = 1/current * 100
    var embed = new discord.MessageEmbed()
        .setColor(color.lightblue)
        .setTitle('KeksBox Spawnrate')
        .setDescription(`\`${serverdata[msg.guild.id].prefix}settings kbspawn <Zahl | Prozentzahl | reset>\`\nDieser Befehl ändert die Rate, in der KeksBoxen durchschnittlich spawnen.\n\n
 · \`Zahl\`: Eine Zahl zwischen 20 und 10000. Diese Zahl repräsentert die durchschnittlichen Nachrichten zwischen den KeksBoxen.
 · \`Prozentzahl\`: Alternativ zu einer Zahl kann ein Wert in Prozent (x%) angegeben werden.
   Dies repräsentiert die Wahrscheinlichkeit bei jeder Nachricht, eine Box zu spawnen.
   Erzielt das gleiche wie eine Zahl, ist aber eine andere Art der Eingabe.
 · \`reset\`: Setzt die Wahrscheinlichkeit auf den Standard Wert, 1%. Im Durchschnitt spawnt also eine KeksBox pro 100 Nachrichten.`)
        .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        .addField('Wahrscheinlichkeit', `Die Wahrscheinlichkeit liegt aktuell bei **${p}%**.\nDas entspricht circa ${current} Nachrichten.`, true)
    var message = await msg.channel.send(embed)
    await delay(45000)
    if(!message.deleted) message.delete().catch()
    return
}