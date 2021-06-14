const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['claim', 'claimbox', 'c'],
    description: 'Claimt eine vorhandene KeksBox.',
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
            var multiplier = serverdata[msg.guild.id].kbq || 100
            var x = Math.round(Math.random() * 6 * multiplier) + Math.round(Math.random() * 5 * multiplier)
            userdata[msg.author.id].cookies = userdata[msg.author.id].cookies + x
            delete serverdata[msg.guild.id].gift
            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
            fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
            embeds.success(msg, "Paket eingesammelt", `${msg.author.username} hat das Paket aufgesammelt.\nDarin waren ${x} Kekse.`)
            try {
            var channels = msg.guild.channels.cache.filter(c => c.type === 'text').array()
            channels.forEach(async channel => {
                await channel.messages.fetch()
                if(channel.messages.cache.has(temp)) {
                    var message = channel.messages.cache.get(temp)
                    if(message && !message.deleted) {
                        await message.delete()
                        return
                    }
                }
            })
        } catch (err) {console.error(err)}
        } else {
            embeds.error(msg, "Fehler", "Hier gibt es nichts zu claimen.")
        }
    }
}