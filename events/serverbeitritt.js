const config = require('../config.json')
const emotes = require('../emotes.json')
const fs = require('fs')

module.exports = {
    name: 'Serverbeitritt',
    event: 'guildCreate',
    async on(g, client) {
        if(!g.systemChannel) {
            const serverdata = require('../serverdata.json')
            serverdata[g.id] = {}
            serverdata[g.id].thismin = 0
            serverdata[g.id].lv = 1
            serverdata[g.id].xp = 0
            serverdata[g.id].prefix = config.prefix
            fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
            return
        }
        embed = new discord.MessageEmbed()
            .setColor(color.yellow)
            .setTitle(`${emotes.pinging} Daten werden angelegt...`)
            .setDescription('Vielen Dank für die Einladung.\nAlle zur Nutzung erforderlichen Daten werden angelegt.\nDies kann einige Zeit dauern.')
        g.systemChannel.send(embed).then(resultmsg => {
        const serverdata = require('./serverdata.json')
        try {
            serverdata[g.id] = {}
            serverdata[g.id].thismin = 0
            serverdata[g.id].lv = 1
            serverdata[g.id].xp = 0
            serverdata[g.id].prefix = '-'
            fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
            embed = new discord.MessageEmbed()
                .setColor(color.lime)
                .setTitle(`${emotes.cookie} Hewwuu`)
                .setDescription('Vielen Dank, dass Ihr den KeksBot verwendet.\nAlle erforderlichen Daten wurden bereits angelegt, mit `-help` gibt es eine Liste aller Commands.\nViel Spaß mit dem Bot :3')
            resultmsg.edit('',embed)
        } catch (err) {
            console.log('Failed creating data for server:',g.id)
            console.log('----------------------')
            console.log(err)
            console.log('----------------------')
            console.log(serverdata)
            console.log('----------------------')
            console.log(g.id)
            embed = new discord.MessageEmbed()
                .setColor(color.red)
                .setTitle('<:denied:775004095056052225> Fehler')
                .setDescription('Beim Anlegen der Daten ist ein Fehler aufgetreten.\nBitte gib ``-activate`` ein, um das System manuell zu aktivieren.\nWir entschuldigen uns für diese Unannehmlichkeiten.')
            resultmsg.edit('',embed).then(async msg => {await delay(20000); if(!msg.deleted) msg.delete()}).catch()
        }}).catch()
    }
}