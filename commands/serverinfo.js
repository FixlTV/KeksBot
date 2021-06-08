const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['serverinfo'],
    description: 'Zeigt Informationen zum Server.',
    type: 'info',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        var id           = msg.guild.id
        var embed        = new discord.MessageEmbed()
        var guildname    = [msg.guild.name]
        var verificationlevel
        var region
        var regiondata   = msg.guild.region
        var vl           = msg.guild.verificationLevel
        var level        = serverdata[id].lv
        var boosttier    = 0
        var boostcount   = 0
        if(level > 5) {level = 5}
        if(vl == 'NONE') {
            verificationlevel = ':white_circle: Keins'
        } else {
            if(vl == 'LOW') {
                verificationlevel = ':green_circle: Niedrig'
            } else {
                if(vl == 'MEDIUM') {
                    verificationlevel = ':yellow_circle: Mittel'
                } else {
                    if(vl == 'HIGH') {
                        verificationlevel = ':orange_circle: Hoch'
                    } else {
                        if(vl == 'VERY_HIGH') {
                            verificationlevel = ':red_circle: とても高い'
                        } else {
                            verificationlevel = 'Unbekannt'
                        }
                    }
                }
            }
        }
        if(regiondata == 'europe') {
            region = ':flag_eu: Europa'
        } else if(regiondata == 'brazil') {
            region = ':flag_br: Brasilien'
        } else if (regiondata == 'hongkong') {
            region = ':flag_hk: Hongkong'
        } else if(regiondata == 'india') {
            region = ':flag_in: Indien'
        } else if(regiondata == 'japan') {
            region = ':flag_jp: Japan'
        } else if(regiondata == 'russia') {
            region = ':flag_ru: Russland'
        } else if(regiondata == 'singapore') {
            region = ':flag_sg Singapur'
        } else if(regiondata == 'southafrica') {
            region = ':flag_za: Südafrika'
        } else if(regiondata == 'sydney') {
            region = ':flag_au: Sydney'
        } else if(regiondata == 'us-central') {
            region = ':flag_us: US-Central'
        } else if(regiondata == 'us-east') {
            region = ':flag_us: US-East'
        } else if(regiondata == 'us-south') {
            region = ':flag_us: US-South'
        } else if(regiondata == 'us-west') {
            region = ':flag_us: US-West'
        } else {
            region = ':united_nations: Keksland (unbekannte Region)'
        }
        boosttier = msg.guild.premiumTier
        boostcount = msg.guild.premiumSubscriptionCount
        if(serverdata[id].partner == 1) {
            guildname.unshift(emotes.partnerserver)
        }
        if(serverdata[id].verified == 1) {
            guildname.unshift(emotes.verifiedserver)
        }
        embed.setTitle(guildname.join(' '))
        embed.setColor(color.normal)
        embed.setDescription(`Serverinfo zu ${msg.guild.name}`)
        embed.addField('Name', msg.guild.name, true)
        embed.addField('ID', id, true)
        embed.addField('Owner', `<@${msg.guild.ownerID}>`)
        embed.addField('Mitglieder', msg.guild.memberCount, true)
        embed.addField('Nutzer', msg.guild.members.cache.filter(member => !member.user.bot).size, true)
        embed.addField('Bots', msg.guild.members.cache.filter(member => member.user.bot).size, true)
        embed.addField('Erstellungsdatum', `${msg.guild.createdAt.getDate()}.${msg.guild.createdAt.getMonth()+1}.${msg.guild.createdAt.getFullYear()} ${msg.guild.createdAt.getHours()}:${msg.guild.createdAt.getMinutes()}:${msg.guild.createdAt.getSeconds()}`, true)
        embed.addField('Verifikationslevel', verificationlevel, true)
        embed.addField('Region', region, true)
        if(boostcount != 0) {
            embed.addField('Server Boost', `Level: ${boosttier} \nBoosts: ${boostcount}`)
        }
        embed.addField('Erfahrugspunkte', serverdata[id].xp, true)
        embed.addField('Level', level, true)
        embed.setThumbnail(msg.guild.iconURL())
        embed.setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        msg.channel.send(embed).then(msg =>         
            setTimeout(msg => {
                if(!msg.deleted) {msg.delete()}
            }, 45000, msg)
        )
    }
}
