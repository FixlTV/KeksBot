const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['claim', 'claimbox', 'c'],
    description: 'Claimt ein Keks Paket.',
    type: 'user',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete().catch()
        if(msg.author.id in userdata) {
        } else {
            userdata[msg.author.id] = {}
            userdata[msg.author.id].thismin = 0
            userdata[msg.author.id].xp = 0
            userdata[msg.author.id].lv = 1
            userdata[msg.author.id].cookies = 0
            userdata[msg.author.id].giftdm = 0
            if (config.support == 1) {
                userdata[msg.author.id].firsthour = 1
            }
        }
        if(serverdata[msg.guild.id].gift) {
            var temp = serverdata[msg.guild.id].gift
            var x = Math.round(Math.random() * 1000)
            userdata[msg.author.id].cookies = userdata[msg.author.id].cookies + x
            delete serverdata[msg.guild.id].gift
            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
            fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
            embeds.success(msg, "Paket eingesammelt", `${msg.author.username} hat das Paket aufgesammelt.\nDarin waren ${x} Kekse.`)
            try {
            var channels = msg.guild.channels.cache.filter(c => c.type == 'text').array()
            for(const index in channels) {
                var channel = channels[index]
                if(channel.messages.cache.has(temp)) {
                    try {
                        var message = await channel.messages.fetch(temp)
                        if(!message) {
                        } else {
                            if(message.deleted) {
                            } else {
                                message.delete()
                                break
                            }
                        }
                    } catch (err) {
                        console.log(`${err}, ERROR DETECTED!`)
                    }      
                }
            }
        } catch (err) {console.error(err)}
        } else {
            embeds.error(msg, "Fehler", "Hier gibt es nichts zu claimen.")
        }
    }
}
