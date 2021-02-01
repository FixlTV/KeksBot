const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['badges', 'badge'],
    description: 'Zeigt die Abzeichen des Nutzers an.',
    type: 'user',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        var guild = await client.guilds.fetch('775001585541185546')
        if(guild.members.cache.has(msg.author.id)) {
            var member = guild.member(msg.author)
            var team = member.roles.cache.has('779991897880002561')
        }
        const VIP = require('../VIP.json')
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
            fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2))
        }
        temp = new Array()
        id = msg.author.id
        if(config.mods.includes(id)) {
            temp.push(emotes.mod)
        }
        if(config.devs.includes(id)) {
            temp.push(emotes.dev)
        }
        if(team) {
            temp.push(emotes.team)
        }
        if(VIP[id] == 1) {
            temp.push(emotes.vip)
        }
        if(userdata[id].partner) {
            temp.push(emotes.partner)
        }
        if(userdata[id].firsthour == 1) {
            temp.push(emotes.firsthour)
        }
        
        if(temp.join('') == ''){
            temp.push('Du hast keine Abzeichen.')
        }
        var embed = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${msg.author.username}'s Abzeichen`)
            .setDescription(temp.join(' '))
            .setThumbnail(msg.author.avatarURL())
            .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
        msg.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
    }
}
