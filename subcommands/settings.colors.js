const embeds = require('../embeds')
const fs = require('fs').promises
const discord = require('discord.js')
const delay = require('delay')

module.exports = async (msg, args, client, serverdata) => {
    var embed = new discord.MessageEmbed()
        .setColor(color.lightblue)
        .setTitle('Farbschema')
        .setDescription('Benutze die Reaktionen, um das Farbschema dieses Servers zu ändern.')
        .addField('1️⃣ KeksBot Standard', 'Unsere eigenen (liebevoll ausgewählten) Farben. Und das Rot ist viel zu knallig.\nRot: <:FF0000:844560574145888326>\nGelb: <:F1C40F:844560548925800450>\nGrün: <:2ECC71:844560563899334726>')
        .addField('2️⃣ KeksBot Dark', 'Etwas dunkler als das normale. Wegen der Helligkeit sollten Niemandem die Augen wegbrennen.\nRot: <:7C2718:844611101135208489>\nGelb: <:7F7200:844611101169287179>\nGrün: <:177A33:844611100904914966>')
        .addField('3️⃣ KeksBot Gray', 'Für Leute, die Farben nicht mögen: Unser einmaliges graues Design. Es sind halt einfach nur (langweilige) Graustufen. Je heller, desto besser.\nGrau: <:303030:844614210154922046>\nGrau: <:6B6B6B:844614210402910228>\nHellgrau: <:AFAFAF:844614209911783476> ')
        .addField('4️⃣ Discord', 'Die [2021 Discord Farbauswahl}(https://discord.com/branding). Relativ simpel und wunderschön.\nRot: <:ED4245:844559420611756064>\nGelb: <:FEE75C:844559396419534879>\nGrün: <:57F287:844559430251184178>')
        .addField(':x: Abbrechen', 'Alles bleibt so, wie es ist. <a:pikadance:780088943718825984>')
        .setFooter(`KeksBot ${config.version}`, client.user.avatarURL())
    var message = await msg.channel.send(embed)
}