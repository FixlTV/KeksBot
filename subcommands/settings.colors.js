const embeds = require('../embeds')
const fs = require('fs').promises
const discord = require('discord.js')
const delay = require('delay')
const config = require('../config.json')

module.exports = async (msg, args, client, serverdata, color) => {
    var embed = new discord.MessageEmbed()
        .setColor(color.lightblue)
        .setTitle('Farbschema')
        .setDescription('Benutze die Reaktionen, um das Farbschema dieses Servers zu ändern.')
        .addField('1️⃣ KeksBot Standard', 'Unsere eigenen (liebevoll ausgewählten) Farben. Und das Rot ist viel zu knallig.\nRot: <:FF0000:844560574145888326>\nGelb: <:F1C40F:844560548925800450>\nGrün: <:2ECC71:844560563899334726>', true)
        .addField('2️⃣ KeksBot Dark', 'Etwas dunkler als das normale. Wegen der Helligkeit sollten Niemandem die Augen wegbrennen.\nRot: <:7C2718:844611101135208489>\nGelb: <:7F7200:844611101169287179>\nGrün: <:177A33:844611100904914966>', true)
        .addField('3️⃣ KeksBot Gray', 'Für Leute, die Farben nicht mögen: Unser einmaliges graues Design. Es sind halt einfach nur (langweilige) Graustufen. Je heller, desto besser.\nGrau: <:303030:844614210154922046>\nGrau: <:6B6B6B:844614210402910228>\nHellgrau: <:AFAFAF:844614209911783476>', true)
        .addField('4️⃣ Discord', 'Die [2021 Discord Farbauswahl](https://discord.com/branding). Relativ simpel und wunderschön.\nRot: <:ED4245:844559420611756064>\nGelb: <:FEE75C:844559396419534879>\nGrün: <:57F287:844559430251184178>', true)
        .addField(':x: Abbrechen', 'Alles bleibt so, wie es ist. <a:pikadance:780088943718825984>', true)
        .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
    var message = await msg.channel.send(embed)
    const filter = (r, u) => u.id === msg.author.id && ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌'].includes(r.emoji.name)
    var collector = await message.createReactionCollector(filter, { time: 120000, max: 1 })

    collector.on('collect', async r => {
        message.reactions.removeAll().catch()
        switch(r.emoji.name) {
            case '1️⃣':
                if(serverdata[msg.guild.id].theme) delete serverdata[msg.guild.id].theme
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                return embeds.success(message, 'Farben geändert', 'Die Farbänderung wurde erfolgreich übernommen und ab jetzt angewandt.', true)
            case '2️⃣':
                serverdata[msg.guild.id].theme = { red: '0x7C2718', yellow: '0x7F7200', lime: '0x177A33' }
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                return embeds.success(message, 'Farben geändert', 'Das dunkle Design wird nun verwendet.', true)
            case '3️⃣':
                serverdata[msg.guild.id].theme = { red: '0x303030', yellow: '0x6B6B6B', lime: '0xAFAFAF' }
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                return embeds.success(message, 'Farben geändert', 'Das graue Design wird nun verwendet.', true)
            case '4️⃣':
                serverdata[msg.guild.id].theme = { red: '0xED4245', yellow: '0xFEE75C', lime: '0x57F287' }
                await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
                return embeds.success(message, 'Farben geändert', 'Das [Discord 2021 Design](https://discord.com/branding) wird nun verwendet.\n**Protipp**: Benutze `' + serverdata[msg.guild.id].prefix + 'settings color blurple`, um das Design zu perfektionieren.', true)
            case '❌':
                return message.delete()
        }
    })

    if(!message.deleted) await message.react('1️⃣').catch()
    if(!message.deleted) await message.react('2️⃣').catch()
    if(!message.deleted) await message.react('3️⃣').catch()
    if(!message.deleted) await message.react('4️⃣').catch()
    if(!message.deleted) await message.react('❌').catch()
    if(!message.deleted) await delay(120000)
    if(!message.deleted) message.reactions.removeAll().catch(); else return
    await delay(20000)
    if(!message.deleted) message.delete().catch()
    return
}