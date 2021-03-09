const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['cookies', 'k', 'kekse'],
    expectedArgs: '<Zahl>',
    minArgs: 1,
    maxArgs: 1,
    description: 'Sammelt Kekse ein. Geht nur einmal pro Minute.',
    type: 'cookie',
    callback: (msg, args, client, serverdata, userdata, config, color) => {
        const VIPs = require('../VIP.json')
        var xmessage
        msg.delete()
        var id = String(msg.author.id)
        if(id in userdata) {
        } else {
            userdata[id] = {}
            userdata[id].thismin = 0
            userdata[id].xp = 0
            userdata[id].lv = 1
            userdata[id].cookies = 0
            userdata[id].giftdm = 0
            if (config.support == 1) {
                userdata[id].firsthour = 1
            }
            fs.writeFileSync('./userdata.json',JSON.stringify(userdata, null, 2))
            console.log(`Daten für ${msg.author.username} | ${msg.author.id} angelegt.`)
        }
        if(msg.guild.id in serverdata) {
            if(!isNaN(args.join(' '))) {
                if(args.join('') > 0) {
                    if(VIPs[msg.author.id] == 1) { //if user is VIP
                    if(args > config.maxVIP - userdata[id].thismin) {
                        args = config.maxVIP - userdata[id].thismin
                    }
                    } else if (userdata[id].partner) {
                    if(args > config.maxP - userdata[id].thismin) {
                        args = config.maxP - userdata[id].thismin
                    }
                    } else { //if user is not VIP
                    if(args > config.max - userdata[id].thismin) {
                        args = config.max - userdata[id].thismin
                    }
                    }
                    if(serverdata[msg.guild.id].lv == 1) { //if server is lv 1
                    if(args > config.maxlv1 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv1 - serverdata[msg.guild.id].thismin
                    }
                    }
                    if(serverdata[msg.guild.id].lv == 2) { //if server is lv 2
                    if(args > config.maxlv2 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv2 - serverdata[msg.guild.id].thismin
                    }
                    }
                    if(serverdata[msg.guild.id].lv == 3) { //if server is lv 3
                    if(args > config.maxlv3 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv3 - serverdata[msg.guild.id].thismin
                    }
                    }
                    if(serverdata[msg.guild.id].lv == 4) { //if server is lv 4
                    if(args > config.maxlv4 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv4 - serverdata[msg.guild.id].thismin
                    }
                    }
                    //if server is lv 5
                    if(((serverdata[msg.guild.id].lv >= 5) && (serverdata[msg.guild.id].lv <= 7)) && (serverdata[msg.guild.id].lv != 8)) {
                    if(args > config.maxlv5 - serverdata[msg.guild.id].thismin) {
                        args = config.maxlv5 - serverdata[msg.guild.id].thismin
                    }
                    }
                    if((serverdata[msg.guild.id].partner == 1)) { //if server is partnered
                        if(args > config.maxPartner - serverdata[msg.guild.id].thismin) {
                            args = config.maxPartner - serverdata[msg.guild.id].thismin
                        }
                    }
                    args = Number(args)
                    userdata[id].cookies = Number(userdata[id].cookies) + Number(args)
                    serverdata[msg.guild.id].thismin = Number(serverdata[msg.guild.id].thismin) + args
                    userdata[id].thismin = Number(userdata[id].thismin) + args
                    fs.writeFileSync('./userdata.json',JSON.stringify(userdata, null, 2))
                    fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
                    if(args != 0) {
                        embeds.cookie(msg, args, userdata[id].cookies)
                    } else {
                        embeds.error(msg, "Keksfehler", "Aufgrund des KeksLimits können dir diese Minute keine Kekse mehr ausgeliefert werden.")
                    }
                } else {
                    embeds.error(msg, "Syntaxfehler", "Bitte gib eine positive Zahl an.")
                }
            } else {
                embeds.error(msg, 'Syntaxfehler', `${args.join(' ')} ist keine gültige Zahl.`)
            }
        } else {
            embeds.error(msg, 'Systemfehler', 'Auf diesem Server wurde das System noch nicht aktiviert.\nBitte einen Administrator, es mit ``-activate main`` zu starten.')
        }    
        return Promise.resolve(xmessage)
    }
}
