const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')
const delay = require('delay')
const loadCommands = require('./cmdloader')

module.exports = {
    description: 'Zeigt das da an. Wow',
    commands: ['help', 'commands'],
    type: 'info',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        if(!serverdata[msg.guild.id]) {
            embeds.error(msg, 'KEKSSYSTEM INAKTIV', 'Für euren Server wurden noch keine Daten angelegt.\nBitte verwende `-activate main`, um den KeksBot zu aktivieren.')
            return
        }
        if(serverdata[msg.guild.id]) {
            var prefix = serverdata[msg.guild.id].prefix
        } else {
            var prefix = config.prefix
        }
        var embedhome = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} KeksBot Hilfe`)
            .setDescription('Willkommen bei der KeksBot Hilfe! Solltest du Fragen oder Wünsche haben, tritt einfach dem [Support Server](https://discord.gg/g8AkYzWRCK) bei.\nDieses Hilfemenü ist in Kategorien unterteilt. Um eine Kategorie zu öffnen, reagiere mit dem entsprechenden Emoji.')
            .addField(':house_with_garden: Home', 'Hier bist du gerade. Enthält keine Befehle.', true)
            .addField(':information_source: Informationsbefehle', 'Befehle, die den Nutzer über diverse Dinge informieren (z.B.: serverinfo)', true)
            .addField(':busts_in_silhouette: Nutzerbefehle', 'Befehle für jeden, die nicht der Information dienen.', true)
            .addField(`${emotes.cookie} Keks Befehle`, 'Diese Befehle geben dir Kekse. Oder auch nicht.', true)
        if(serverdata[msg.guild.id].mod == 1) {
            embedhome.addField(':hammer: Moderationsbefehle', 'Diese Befehle dienen der Moderierung eures Servers.', true)
        }
        embedhome.addField(':gear: Einstellungen', 'Diese Befehle können nur Serveradmins verwenden.', true)
        embedhome.addField(`${emotes.denied} Menü schließen`, 'Schließt dieses Hilfemenü (Löscht die Nachricht und alle Reactions).', true)
        embedhome.setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 2 Minuten ab.`, client.user.avatarURL())

        var message = await msg.channel.send(embedhome)
        var embedinfo = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} KeksBot Hilfe | :information_source:`)
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 2 Minuten ab.`, client.user.avatarURL())
            .setDescription('Mögliche Argumente:\n`<> Benötigt. Ohne dieses Argument funktioniert der Command nicht.\n[] Optional. Dieses Argument kann weggelassen werden`')
        var embeduser = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} KeksBot Hilfe | :busts_in_silhouette:`)
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 2 Minuten ab.`, client.user.avatarURL())
            .setDescription('Mögliche Argumente:\n`<> Benötigt. Ohne dieses Argument funktioniert der Command nicht.\n[] Optional. Dieses Argument kann weggelassen werden`')
        var embedcookies = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} KeksBot Hilfe | ${emotes.cookie}`)
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 2 Minuten ab.`, client.user.avatarURL())
            .setDescription('Mögliche Argumente:\n`<> Benötigt. Ohne dieses Argument funktioniert der Command nicht.\n[] Optional. Dieses Argument kann weggelassen werden`')
        var embedadmin = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} KeksBot Hilfe | :gear:`)
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 2 Minuten ab.`, client.user.avatarURL())
            .setDescription('Mögliche Argumente:\n`<> Benötigt. Ohne dieses Argument funktioniert der Command nicht.\n[] Optional. Dieses Argument kann weggelassen werden`')
        var embedmod = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} KeksBot Hilfe | :hammer:`)
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 2 Minuten ab.`, client.user.avatarURL())
            .setDescription('Mögliche Argumente:\n`<> Benötigt. Ohne dieses Argument funktioniert der Command nicht.\n[] Optional. Dieses Argument kann weggelassen werden`')
        const commands = loadCommands()
        for(const command of commands) {
            const mainCommand = 
                typeof command.commands === 'string'
                    ? command.commands
                    : command.commands[0]
            const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const { description } = command
            const { type } = command
            if(type == 'info') {
                embedinfo.addField(mainCommand, `\`${prefix}${mainCommand}${args}\`\n${description}`, true)
            } else if(type == 'user') {
                embeduser.addField(mainCommand, `\`${prefix}${mainCommand}${args}\`\n${description}`, true)
            } else if(type == 'cookie') {
                embedcookies.addField(mainCommand, `\`${prefix}${mainCommand}${args}\`\n${description}`, true)
            } else if(type == 'admin') {
                embedadmin.addField(mainCommand, `\`${prefix}${mainCommand}${args}\`\n${description}`, true)
            } else if(type == 'unlisted') {
            } else if(type == 'mod') {
                embedmod.addField(mainCommand, `\`${prefix}${mainCommand}${args}\`\n${description}`, true)
            } else {
                console.error(`Unknown command type '${type}' at '${mainCommand}'`)
            }
        }

        const filterh = (reaction, user) => reaction.emoji.name === '🏡' && user.id == msg.author.id
        const filteri = (reaction, user) => reaction.emoji.name === 'ℹ️' && user.id == msg.author.id
        const filteru = (reaction, user) => reaction.emoji.name === '👥' && user.id == msg.author.id
        const filterc = (reaction, user) => reaction.emoji.id === emotes.cookie.split(':')[2].replace('>','') && user.id == msg.author.id
        const filtera = (reaction, user) => reaction.emoji.name === '⚙️' && user.id == msg.author.id
        const filterx = (reaction, user) => reaction.emoji.id === '775004095056052225' && user.id == msg.author.id
        const filterm = (reaction, user) => reaction.emoji.name === '🔨' && user.id == msg.author.id

        const embedh = message.createReactionCollector(filterh, {time: 120000})
        const embedi = message.createReactionCollector(filteri, {time: 120000})
        const embedu = message.createReactionCollector(filteru, {time: 120000})
        const embedc = message.createReactionCollector(filterc, {time: 120000})
        const embeda = message.createReactionCollector(filtera, {time: 120000})
        const embedx = message.createReactionCollector(filterx, {time: 120000})
        const embedm = message.createReactionCollector(filterm, {time: 120000})

        embedh.on('collect', r =>{
            message.edit(embedhome)
            r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
        })
        embedi.on('collect', r =>{
            message.edit(embedinfo)
            r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
        })
        embedu.on('collect', r =>{
            message.edit(embeduser)
            r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
        })
        embedc.on('collect', r =>{
            message.edit(embedcookies)
            r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
        })
        embeda.on('collect', r =>{
            message.edit(embedadmin)
            r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
        })
        embedm.on('collect', r => {
            message.edit(embedmod)
            r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first())
        })
        embedx.on('collect', r =>{
            message.delete().catch()
            return
        })

        await message.react('🏡').catch(err => {return})
        await message.react('ℹ️').catch(err => {return})
        await message.react('👥').catch(err => {return})
        await message.react(emotes.cookie.split(':')[2].replace('>','')).catch(err => {return})
        await message.react('🔨').catch(err => {return})
        await message.react('⚙️').catch(err => {return})
        await message.react('775004095056052225').catch(err => {return})


        await delay(120000)
        if(message.deleted) return
        await message.reactions.removeAll()
        return
    }
}