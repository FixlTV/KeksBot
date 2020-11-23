const discord = require('discord.js')
const fs      = require('fs')
const config  = JSON.parse(fs.readFileSync('./config.json'))
const embeds  = require('./embeds')

//main data script

module.exports = {
    kekse(msg, args, client) {
        msg.delete()
        if(!isNaN(args.join(' '))) {
            var VIPs = JSON.parse(fs.readFileSync('./VIP.json'))
            var userdata = JSON.parse(fs.readFileSync('./userdata.json'))
            if(VIPs[msg.author.id] = 1) {
                if(args > config.maxVIP - userdata[msg.author.id].thismin) {
                    args = config.maxVIP - userdata[msg.author.id].thismin
                }

            } else {
                if(args > config.max - userdata[msg.author.id].thismin) {
                    args = config.max - userdata[msg.author.id].thismin
                }
                
            }
        } else {
            embeds.error(msg, ':x: Syntaxfehler', `${args.join(' ')} ist keine gültige Zahl.`)
        }
    }
}