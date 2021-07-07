const fs = require('fs')
const embeds = require('../embeds')
const discord = require('discord.js')

module.exports = {
    commands: ['shutdown', 'stop', 'destroy', 'kill'],
    modonly: 1,
    description: 'Schaltet den Bot aus. Nur im Notfall einsetzen!',
    type: 'modonly',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        if(config.mods.includes(msg.author.id)) {
            msg.delete()
            var user = msg.author.id
            var embed = new discord.MessageEmbed()
                .setColor(color.lightblue)
                .setTitle('Selbstzerstörung eingeleitet.')
                .setDescription('Die Selbstzerstörung wird eingeleitet.\nBitte gib die aktuelle TAN ein.')
            var message = await msg.channel.send(embed)
            const messagefilter = (message) => message.content === config.tan && message.author.id == msg.author.id
            var tanmessage = await msg.channel.awaitMessages(messagefilter, {max:1, time: 30000, errors: ['time']}).catch(async (err) => {
                embed.setColor(color.red)
                embed.setDescription('TAN Abfrage ausgelaufen.\nDeine Eingabe hat zu lange gedauert. Bitte probiere es erneut.')
                embed.setTitle('Selbstzerstörung abgebrochen.')
                await message.edit(embed)
                setTimeout(message => {
                    if(!message.deleted) {message.delete()}
                    return
                }, 10000, message)
            })
            if(!tanmessage) return
            tanmessage.first().delete().catch(err => {console.error(err)})
            var tan = []
            for(var length = 0; length < 9; length++) {
                if(length == 4) {
                    tan.push('-')
                } else {
                    var temp = Math.floor(Math.random()*35+1)
                    switch(temp) {
                        case 1: tan.push('a'); break
                        case 2: tan.push('b'); break
                        case 3: tan.push('c'); break
                        case 4: tan.push('d'); break
                        case 5: tan.push('e'); break
                        case 6: tan.push('f'); break
                        case 7: tan.push('g'); break
                        case 8: tan.push('h'); break
                        case 9: tan.push('i'); break
                        case 10: tan.push('j'); break
                        case 11: tan.push('k'); break
                        case 12: tan.push('l'); break
                        case 13: tan.push('m'); break
                        case 14: tan.push('n'); break
                        case 15: tan.push('o'); break
                        case 16: tan.push('p'); break
                        case 17: tan.push('q'); break
                        case 18: tan.push('r'); break
                        case 19: tan.push('s'); break
                        case 20: tan.push('t'); break
                        case 21: tan.push('u'); break
                        case 22: tan.push('v'); break
                        case 23: tan.push('w'); break
                        case 24: tan.push('x'); break
                        case 25: tan.push('y'); break
                        case 26: tan.push('z'); break
                        case 27: tan.push(1); break
                        case 28: tan.push(2); break
                        case 29: tan.push(3); break
                        case 30: tan.push(4); break
                        case 31: tan.push(5); break
                        case 32: tan.push(6); break
                        case 33: tan.push(7); break
                        case 34: tan.push(8); break
                        case 35: tan.push(9); break
                        case 36: tan.push(0); break
                        default: break
                    }
                }
            }
            config.tan = tan.join('')
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            const filter = (reaction, user) => reaction.emoji.id === '775004095056052225' && user.id == msg.author.id
            const reaction = message.createReactionCollector(filter, {time: 15000})
            reaction.on('collect', (r) => {
                r.message.delete()
                return
            })
            await message.react('775004095056052225').catch(err => {return})
            embed.setColor(color.lime)
            embed.setDescription('**TAN-Eingabe erfolgreich.**\nSelbstzerstörung in: **5**')
            embed.setFooter('Reagiere, um den Vorgang abzubrechen.')
            await message.edit(embed).catch(err => {return})
            setTimeout((msg, embed) => {
                if(!msg.deleted) {
                    embed.setDescription('Selbstzerstörung in: **4**')
                    msg.edit(embed)
                    setTimeout((msg, embed) => {
                        if(msg.deleted) return
                        embed.setColor(color.yellow)
                        embed.setDescription('Selbstzerstörung in: **3**')
                        msg.edit(embed)
                        setTimeout((msg, embed) => {
                            if(msg.deleted) return
                            embed.setColor(color.red)
                            embed.setDescription('Selbstzerstörung in: **2**')
                            msg.edit(embed)
                            setTimeout((msg, embed) => {
                                if(msg.deleted) return
                                embed.setDescription('Selbstzerstörung in: **1**')
                                msg.edit(embed)
                                setTimeout(async (msg) => {
                                    await msg.delete()
                                    console.error(`${user.username} hat den Bot heruntergefahren.`)
                                    client.destroy()
                                    process.exit()
                                }, 1000, msg)
                            }, 1000, msg, embed)
                        }, 1000, msg, embed)
                    }, 1000, msg, embed)
                }
            }, 1000, message, embed)
        } else {
            msg.delete()
        }
    }
}
