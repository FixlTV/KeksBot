const discord = require('discord.js')

/**
 * 
 * @param {discord.Message} msg 
 * @param {[String]} args 
 * @param {String} text 
 * @returns [[discord.GuildMember], String]
 */

module.exports = async (msg, args, text) => {
    var members = new Array()
    if(msg.mentions.members.size > 0) {
        members = msg.mentions.members.array()
        members.forEach(member => {
            text = text.replace(`<@${member.id}>`, '')
            text = text.replace(`<@!${member.id}>`, '')
        })
    } else {
        var guildMembers = await msg.guild.members.fetch()
        guildMembers.array().forEach(member => {
            if(text.toLowerCase().startsWith(member.user.username.toLowerCase()) || text.toLowerCase().startsWith(member.displayName.toLocaleLowerCase()) || (args[0] && member.displayName.toLowerCase().startsWith(args[0].toLowerCase()) && args[0].length > 2) || (args[0] && member.user.username.toLowerCase().startsWith(args[0].toLowerCase()) && args[0].length > 2)) {
                members.push(member)
                if(text.toLowerCase().startsWith(member.user.username.toLowerCase())) {
                    text = text.trim()
                    var name = member.user.username
                    while (name.length > 0 && name[0].toLowerCase() === text.charAt(0).toLowerCase()) {
                        name = name.substring(1)
                        text = text.substring(1)
                    }
                } else if(text.toLowerCase().startsWith(member.user.username.toLowerCase())) {
                    text = text.trim()
                    var name = member.displayName
                    console.log(text.toLowerCase())
                    while (name.length > 0 && name[0].toLowerCase() === text.charAt(0).toLowerCase()) {
                        name = name.substring(1)
                        text = text.substring(1)
                    }
                } else if(member.displayName.length > 2 && member.displayName.toLowerCase().startsWith(args[0].toLowerCase())) {
                    var name = member.displayName
                    while (name.length > 0 && name[0].toLowerCase() === text.charAt(0).toLowerCase()) {
                        name = name.substring(1)
                        text = text.substring(1)
                    }
                } else if(member.user.username.length > 2 && member.user.username.toLowerCase().startsWith(args[0].toLowerCase())) {
                    var name = member.user.username
                    while (name.length > 0 && name[0].toLowerCase() === text.charAt(0).toLowerCase()) {
                        name = name.substring(1)
                        text = text.substring(1)
                    }
                }
            }
        })
    }
    text = text.trim()
    return [members, text]
}