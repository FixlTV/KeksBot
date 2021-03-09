const fs = require('fs').promises
const embeds = require('../embeds')
const discord = require('discord.js')
const delay = require('delay')

module.exports = {
    commands: ['cleardata', 'resetdata'],
    expectedArgs: '',
    description: 'Löscht alle deine Daten',
    type: 'user',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        const filter = (m) => (m.content.toLowerCase() === 'ja','nein') && m.author.id === msg.author.id
        var embed = new discord.MessageEmbed().setColor(color.normal).setTitle('Daten löschen?').setDescription('**ACHTUNG**: Wenn du jetzt fortfährst werden deine gesamten Daten aus dem System gelöscht.\nSolltest du Partner sein, beachte bitte, dass die Daten erst gelöscht werden können, wenn alle Partnerschaften aufgelöst wurden.').setFooter('Zum Fortfahren, antworte mit "Ja".')
        var message = await msg.channel.send(embed)
        const messages = await msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']}).catch(async (err) => {
            embed.setColor(color.red)
            embed.setTitle('Vorgang abgebrochen')
            embed.setDescription('zeitüberschreitung. Bitte probiere es erneut.')
            embed.setFooter('')
            if(!message.deleted) await message.edit(embed)
            await delay(5000)
            if(!message.deleted) message.delete().catch()
            return
        })
        var answer = messages.first()
        if(answer.content.toLowerCase() === 'nein') {
            embed.setColor(color.red)
            embed.setTitle('Vorgang abgebrochen')
            embed.setDescription('Der Vorgang wurde erfolgreich abgebrochen. Alle Daten wurden gesichert.')
            embed.setFooter('')
            if(!message.deleted) await message.edit(embed)
            await delay(5000)
            if(!message.deleted) await message.delete().catch()
            return
        } else if(answer.content.toLowerCase() === 'ja') {
            embed.setColor(color.yellow).setTitle(`${emotes.pinging} Daten werden gelöscht`).setDescription('Dies kann einige Zeit dauern...').setFooter('Deine Daten werden nun gelöscht. Diese Aktion kann nicht mehr rückgängig gemacht werden.')
            if(message.deleted) return embeds.error(msg, 'Vorgang abgebrochen', 'Die ursprüngliche Informationsnachricht wurde gelöscht. Die Daten werden nicht gelöscht.')
            await message.edit(embed)
            if(userdata[msg.author.id].partner) {embed.setTitle('Vorgang abgebrochen').setColor(color.red).setDescription('Du bist Partner. Bitte entferne erst den Bot von allen Partnerservern, um Fehlfunktionen zu vermeiden.').setFooter(''); await message.edit(embed); await delay(5000); if(!message.deleted) message.delete().catch(); return}
            delete userdata[msg.author.id]
            await fs.writeFile('userdata.json', JSON.stringify(userdata, null, 2))
            var embed = new discord.MessageEmbed()
                .setColor(color.lime)
                .setTitle('🗑 Daten gelöscht.')
                .setDescription('Alle deine Daten wurden erfolgreich gelöscht.')
            if(!message.deleted) await message.edit(embed)
            await delay(5000)
            if(!message.deleted) await message.delete().catch()
            return
        }
    }
}