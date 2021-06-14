const discord = require('discord.js')
const delay = require('delay')
const { Collection } = require('discord.js')

module.exports = {
    name: 'help',
    commands: ['commands'],
    type: 'info',
    description: 'Zeigt das hier an',
    expectedArgs: '[command]',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete().catch()
        var prefix = config.prefix
        if(serverdata[msg.guild.id]) prefix = serverdata[msg.guild.id].prefix
        // if(args[0]) {
        //     var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.commands && cmd.commands.includes(commandName))
        //     if(command) {

        //         return
        //     }
        // }
        const categories = require('./help.categories.json')
        const embed = {}
        var emotearray = ['denied']
        embed.home = new discord.MessageEmbed()
            .setColor(color.normal)
            .setTitle(`${emotes.cookie} KeksBot Hilfe`)
            .setDescription('Willkommen bei der KeksBot Hilfe! Solltest du Fragen oder Wünsche haben, tritt einfach dem [Support Server](https://discord.gg/g8AkYzWRCK) bei.\nDieses Hilfemenü ist in Kategorien unterteilt. Um eine Kategorie zu öffnen, reagiere mit dem entsprechenden Emoji.')
            .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 2 Minuten ab.`, client.user.avatarURL())
        for (var key in categories) {
            var category = categories[key]
            embed.home.addField(`${category.emote} ${category.name}`, category.description, true)
        }
        embed.home.addField(`${emotes.denied} Menü schließen.`, 'Schließt dieses Menü.')
        var message = await msg.channel.send(embed.home).catch()

        for (var key in categories) {
            var data = categories[key]
            if(data.emote.includes('<')) {
                emote = data.emote.split(':')[1]
            } else emote = data.emote
            emotearray.push(emote)
            if(data.id !== 'home') {
                embed[data.id] = new discord.MessageEmbed()
                    .setColor(color.normal)
                    .setTitle(`${emotes.cookie} KeksBot Hilfe | ${data.emote}`)
                    .setFooter(`KeksBot ${config.version} | Dieses Formular läuft nach 2 Minuten ab.`, client.user.avatarURL())
                    .setDescription(`Mögliche Argumente:\n\`<> Benötigt. Ohne dieses Argument funktioniert der Command nicht.\n[] Optional. Dieses Argument kann weggelassen werden\`\n\nVerwende \`${prefix}help <command>\`, um mehr über einen spezifischen Befehl zu erfahren.`)
                client.commands.array().forEach(command => {
                    var desc = command.description
                    const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
                    if(!desc) desc = ''
                    if(command.type === data.id) embed[data.id].addField(command.name, `\`${prefix}${command.name}${args}\`\n${desc}`, true)
                })
            }
        }
        const filter = (reaction, user) => emotearray.includes(reaction.emoji.name) && user.id === msg.author.id
        const collector = await message.createReactionCollector(filter, {time: 120000})

        collector.on('collect', async r => {
            for (var key in categories) {
                var data = categories[key]
                if(data.emote.includes('<')) {
                    emote = data.emote.split(':')[1]
                } else emote = data.emote
                if(emote === r.emoji.name) {
                    await r.users.remove(r.users.cache.filter(u => u.id === msg.author.id).first()).catch()
                    await message.edit(embed[data.id]).catch()
                    return
                }
            }
            if(r.emoji.name === 'denied') return await message.delete().catch()
        })

        for(var key in categories) {
            var data = categories[key]
            await message.react(data.emote).catch()
        }
        await message.react(emotes.denied)

        await delay(120000)
        if(message.deleted) return
        await message.delete().catch()
        return
    }
}