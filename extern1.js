const discord = require('discord.js')
const client  = discord.Client
const fs      = require('fs')
const config  = JSON.parse(fs.readFileSync('./config.json'), null, 2)
const version = config.version

//content: badges

const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}

module.exports = {
    badge(msg, avatar) {
        var message
        var temp_ = 0
        var temp = []
        if(config.mods.includes(msg.author.id)) {
            temp.push("<:Modbadge:775004127531892758>")
            var temp_ = 1
        }
        if(config.devs.includes(msg.author.id)) {
            temp.push("<:Devbadge:775004113132847135>")
            var temp_ = 1
        }
        if(JSON.stringify(fs.readFileSync('./VIP.json'))[msg.author.id] = 1) {
            temp.push("<:VIPbadge:775004159686213644>")
            var temp_ = 1
        }
        if(temp_ == 0) {
            temp.push('Du hast keine Abzeichen.')
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${msg.author.username}'s Abzeichen`)
            .setDescription(temp.join(' '))
            .setFooter(`© KeksBot ${version}`,avatar)
            .setThumbnail(msg.author.avatarURL())
        msg.channel.send("",embed).then((msg) => {
            message = msg
        }).then(msg.delete({ timeout: 60000 }))
        return Promise.resolve(message)
    }
}