const color = {normal: 0x00b99b}

module.exports = {
    name: 'KeksBot Support Server Autorole',
    event: 'guildMemberAdd',
    on(member, client) {
        if(member.guild.id !== '775001585541185546') return
        const userdata = require('../userdata.json')
        const VIP      = require('../VIP.json')
        var roles = []
        if(userdata[member.id] && userdata[member.id].partner) {
            let role = member.guild.roles.cache.find(r => r.name.toLowerCase() === "Partner".toLowerCase())
            roles.push(role)
        }
        if(VIP[member.id]) {
            let role = member.guild.roles.cache.find(r => r.name.toLowerCase() === "VIP".toLowerCase())
            roles.push(role)
        }
        if(config.mods.includes(member.id)) {
            let role = member.guild.roles.cache.find(r => r.name.toLowerCase() === 'Moderator'.toLowerCase())
            roles.push(role)
        }
        if(config.devs.includes(member.id)) {
            let role = member.guild.roles.cache.find(r => r.name.toLowerCase() === 'Developer'.toLowerCase())
            roles.push(role)
        }
        if(roles.length) member.roles.add(roles).catch()
        try {
            member.user.createDM().then(channel => {
                var embed = new discord.MessageEmbed()
                    .setColor(color.normal)
                    .setTitle(`Willkommen, ${member.user.username}`)
                    .setDescription('Herzlich Willkommen auf dem KeksBot Support Server!\n\n**Wozu ist der Server?**\nDen KeksBot Support Server gibt es, um Kekse zu essen. Sehr lecker.\nNoch dazu dient (wie der Name eigentlich schon sagen sollte) dem Support.\nAußerdem gibt es Updates und Informationen zum Bot, sowie viele nette Menschis :3')
                    .setFooter(copyright, config.avatarURL)
                    .setThumbnail(config.avatarURL)
                channel.send(embed)
            })
        } catch (err) {
        }
    }
}