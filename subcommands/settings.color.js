const discord = require('discord.js')
const fs = require('fs').promises
const delay = require('delay')
const emotes = require('../emotes.json')

module.exports = async (msg, args, client, serverdata, color) => {
    const config = require('../config.json')
    if(args[0] && args[0].toLowerCase() === 'role') {
        serverdata[msg.guild.id].color = 'role'
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        var embed = new discord.MessageEmbed()
            .setColor(msg.guild.me.displayHexColor)
            .setTitle(`${emotes.accept} Farbe geändert`)
            .setDescription('\⬅ Das ist die neue Farbe für Embeds.\nSollte sich die Anzeigefarbe des Bots ändern, wird sich diese Farbe ebenfalls verändern.')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        await delay(15000)
        if(!message.deleted) message.delete().catch()
        return
    } else if(args[0] && args[0].toLowerCase() === 'reset') {
        delete serverdata[msg.guild.id].color
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        var embed = new discord.MessageEmbed()
            .setColor(0x00b99b)
            .setTitle(`${emotes.accept} Farbe zurückgesetzt`)
            .setDescription('\⬅ Das ist die neue Farbe für Embeds.')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        await delay(15000)
        if(!message.deleted) message.delete().catch()
        return
    } else if(args[0] && (args[0].startsWith('#') || args[0].startsWith('0x'))) {
        if(isNaN(args[0].replace('#', '0x'))) return embeds.error(msg, 'Ungültiger HEX Code', 'Bitte gib einen gültigen HEX-Colorcode an (z.B. `#00b99b`).')
        if(args[0].replace('#', '0x').length != 8) return embeds.error(msg, 'Ungültiger HEX Code', 'Bitte gib einen gültigen HEX-Colorcode an (z.B. `#00b99b`).')
        serverdata[msg.guild.id].color = args[0].replace('#', '0x')
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        var embed = new discord.MessageEmbed()
            .setColor(serverdata[msg.guild.id].color)
            .setTitle(`${emotes.accept} Farbe geändert`)
            .setDescription('\⬅ Das ist die neue Farbe für Embeds.')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        await delay(15000)
        if(!message.deleted) message.delete().catch()
    } else if(args[0] && args[0].toLowerCase() === 'blurple') {
        let embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle('Farbauswahl')
            .setDescription('Welches blurple willst du?')
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        message.react('1️⃣')
        message.react('2️⃣')
        message.react('❌')
        let filter = (r, u) => u.id === msg.author.id && ['1️⃣', '2️⃣', '❌'].includes(r.emoji.name)
        let collector = await message.createReactionCollector(filter, {time: 60000})
        collector.on('collect', async r => {
            let emote = r.emoji.name
            r.users.remove(msg.author.id)
            switch(emote) {
                case '1️⃣': 
                    if(embed.color == 0x7289DA) {
                        serverdata[msg.guild.id].color = '0x7289DA'
                        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                        var new_embed = new discord.MessageEmbed()
                            .setColor(0x7289DA)
                            .setTitle(`<a:LoveDiscord:834728722338545704> Farbe geändert`)
                            .setDescription('Alles ist jetzt schön blurple!')
                            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
                        message.reactions.removeAll().catch()
                        if(!message.deleted) await message.edit(new_embed).catch()
                        await delay(10000)
                        if(!message.deleted) return message.delete().catch()
                    } else {
                        embed.setColor(0x7289DA).setDescription('Um die Auswahl zu speichern, klicke erneut auf die Reaktion.')
                        if(!message.deleted) message.edit(embed).catch()
                    }
                    break
                case '2️⃣':
                    if(embed.color == 0x5865F2) {
                        serverdata[msg.guild.id].color = '0x5865F2'
                        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                        var new_embed = new discord.MessageEmbed()
                            .setColor(0x5865F2)
                            .setTitle(`<a:LoveDiscord:834728722338545704> Farbe geändert`)
                            .setDescription('Alles ist jetzt schön blurple!')
                            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
                        message.reactions.removeAll().catch()
                        if(!message.deleted) await message.edit(new_embed).catch()
                        await delay(10000)
                        if(!message.deleted) return message.delete().catch()
                    } else {
                        embed.setColor(0x5865F2).setDescription('Um die Auswahl zu speichern, klicke erneut auf die Reaktion.')
                        if(!message.deleted) message.edit(embed).catch()
                    }
                    break
                case '❌':
                    return message.delete().catch()
            }
        })
        // serverdata[msg.guild.id].color = '0x7289DA'
        // await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        // var embed = new discord.MessageEmbed()
        //     .setColor(0x7289DA)
        //     .setTitle(`<a:LoveDiscord:834728722338545704> Farbe geändert`)
        //     .setDescription('Alles ist jetzt schön blurple!')
        //     .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        // var message = await msg.channel.send(embed)
        // await delay(15000)
        // if(!message.deleted) message.delete().catch()
    } else {
        var embed = new discord.MessageEmbed()
            .setTitle('Farbeinstellungen')
            .setDescription('Hier kannst du die Farbe von Embeds ändern.\nBenutze `' + serverdata[msg.guild.id].prefix + 'settings color <role | reset | HEX Colorcode>`, um \
die Farbe zu ändern:\n · `role`: Ändert die Farbe zur Rollenfarbe des Bots. Diese wird automatisch geändert.\n · `reset`: Setzt die Farbe zurück. Es wird die \
Standardfarbe (#00b99b) verwendet.\n · `HEX Colorcode`: Ändert die Farbe zu der Angegebenen.\n\n\⬅ Das ist die aktuelle Farbe.')
            .setColor(color.normal)
            .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
        var message = await msg.channel.send(embed)
        await delay(30000)
        if(!message.deleted) message.delete().catch()
        return
    }
}