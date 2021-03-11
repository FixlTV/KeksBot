const discord = require('discord.js')
const client  = new discord.Client
const fs      = require('fs')
const config  = require('./config.json')
const copyright = `© KeksBot ${config.version}`
const loadcmds  = require('./kekscoms/cmdloader')
const emotes = require('./emotes.json')

const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b,
    owo: 0xE3008C
}

client.on('ready', () => { //Main
    var d = new Date()
    var year = d.getFullYear()
    console.log(`[${client.user.username}]: Lade Kekse...`)
    setInterval(() => {
        var userdata = require('./userdata.json')
        for (var k in userdata) {
            var key = k
            userdata[key].thismin = 0
        }
        var serverdata = require('./serverdata.json')
        for (var k in serverdata) {
            var key = k
            serverdata[key].thismin = 0
        }
        fs.writeFileSync('userdata.json', JSON.stringify(userdata, null, 2))
        fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
    }, 60000)
    setInterval(() => { //Neujahr Nachricht
    	d = new Date()
    	if(d.getFullYear() > year) {
    		console.log('Ein neues Jahr hat begonnen!')
    		client.channels.fetch('787237777112301580').then(channel => {
    		var message = `**Frohes neues Jahr ${year}**\nLegga. Es gibt wieder Kekse.\n@everyone`
    		channel.send(message)})
    	}
    	year = d.getFullYear()
    }, 10000)
})
client.on('ready', async () => { //Status
    client.setMaxListeners(0)
    loadcmds(client)
    int = await setInterval(function () {
        let statuses = [
            {
                name: `auf ${client.guilds.cache.size} Servern`,
                type: "PLAYING"
            },
            {
                name: `mit ${client.users.cache.size} Nutzern`,
                type: "PLAYING"
            },
            {
                name: `Musik`,
                type: "LISTENING"
            },
            {
                name: "mit seinen Freunden",
                type: "PLAYING"
            },
            {
                name: `${config.version}`,
                type: "PLAYING"
            },
            {
                name: `auf ${client.channels.cache.size} Channels`,
                type: "WATCHING"
            }
        ]
        let status = statuses[Math.floor(Math.random() * statuses.length)]
        client.user.setActivity(status)
    }, 10000)
})

client.on('message', (msg) => {
    const serverdata = require('./serverdata.json')
    if(msg.author.bot == false && msg.system && msg.content == '<@!774885703929561089>') {
        var embed = new discord.MessageEmbed()
            .setColor(color.normal)
        if(serverdata[msg.guild.id]) {
            embed.setDescription(`Mein Prefix ist: **${serverdata[msg.guild.id].prefix}**`)
        } else {
            embed.setDescription(`Mein Prefix ist: **${config.prefix}**`)
        }
        msg.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }))
    }
})

client.on('message', async (msg) => {
    if(!msg.guild) return
    if(msg.system) return
    const serverdata = require('./serverdata.json')
    if(!serverdata[msg.guild.id]) return
    //Paketbox
    if((msg.author.bot == false) && (!msg.content.startsWith(serverdata[msg.guild.id].prefix)) && (serverdata[msg.guild.id].gift != 1)) {
        var x = Math.round(Math.random() * 100)
        if(x == 1) {
            serverdata[msg.guild.id].gift = 1
            fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
            var y = Math.floor(Math.random() * (4 - 1)) + 1
            if(y == 1) {
                var embed = new discord.MessageEmbed()
                    .setColor(color.normal)
                    .setTitle('Huch!')
                    .setDescription(`Ein Paket voller Keksen erscheint! Los, Pikachu!\nGib \`\`${serverdata[msg.guild.id].prefix}claim\`\` ein, um es einzusammeln.`)
                    .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
            } else {
                if(y == 2) {
                    var embed = new discord.MessageEmbed()
                        .setColor(color.normal)
                        .setTitle('Die Lieferung ist da!')
                        .setDescription(`Ein leckeres Kekspaket ist gerade angekommen.\nGib \`\`${serverdata[msg.guild.id].prefix}claim\`\` ein, um es einzusammeln.`)
                        .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                } else {
                    var embed = new discord.MessageEmbed()
                        .setColor(color.normal)
                        .setTitle('Legga')
                        .setDescription(`Legga Keeeeeeekseeeeee!\nGib \`\`${serverdata[msg.guild.id].prefix}claim\`\` ein, um es einzusammeln.`)
                        .setFooter(`© KeksBot ${config.version}`, client.user.avatarURL())
                }
            }
            msg.channel.send(embed)
        }
    }
    //@anyone
    if(serverdata[msg.guild.id].anyone) {
        args = new Array()
        var args = msg.content.split(' ')
        if(args.includes('@anyone') || args.includes('@anybody') || args.includes('@someone') || args.includes('@somebody') || args.includes('@random')) {
            var member = await msg.channel.members.random(1)
                msg.channel.send(`**${msg.author.username}** randompingt ${member}.`)
        }

    }
})

client.on('guildCreate', (g) => {
    if(!g.systemChannel) {
        const serverdata = require('./serverdata.json')
        serverdata[g.id] = {}
        serverdata[g.id].thismin = 0
        serverdata[g.id].lv = 1
        serverdata[g.id].xp = 0
        serverdata[g.id].prefix = '-'
        fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
    }
    embed = new discord.MessageEmbed()
        .setColor(color.yellow)
        .setTitle(`${emotes.pinging} Daten werden angelegt...`)
        .setDescription('Vielen Dank für die Einladung.\nAlle zur Nutzung erforderlichen Daten werden angelegt.\nDies kann einige Zeit dauern.')
    g.systemChannel.send(embed).then(resultmsg => {
    const serverdata = require('./serverdata.json')
    try {
        serverdata[g.id] = {}
        serverdata[g.id].thismin = 0
        serverdata[g.id].lv = 1
        serverdata[g.id].xp = 0
        serverdata[g.id].prefix = '-'
        fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
        embed = new discord.MessageEmbed()
            .setColor(color.lime)
            .setTitle(`${emotes}`)
            .setDescription('Das KeksSystem wurde erfolgreich aktiviert.\nBenutzt ``-help`` um die Funktionen dieses Bots kennen zu lernen.\nMit ``-prefix`` kann man den Prefix ändern.\n**Viel Spaß beim Kekse essen!**')
        resultmsg.edit('',embed)
    } catch (err) {
        console.log('Failed creating data for server:',g.id)
        console.log('----------------------')
        console.log(err)
        console.log('----------------------')
        console.log(serverdata)
        console.log('----------------------')
        console.log(g.id)
        embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle('<:denied:775004095056052225> Fehler')
            .setDescription('Beim Anlegen der Daten ist ein Fehler aufgetreten.\nBitte gib ``-activate`` ein, um das System manuell zu aktivieren.\nWir entschuldigen uns für diese Unannehmlichkeiten.')
        resultmsg.edit('',embed).then(msg => msg.delete({ timeout: 10000 }))
    }})
})

client.on('guildDelete', async (g) => {
    const serverdata = require('./serverdata.json')
    const userdata = require('./userdata.json')
    if(serverdata[g.id].partner = 1) {
        userdata[g.ownerID].partner --
        if(userdata[g.ownerID].partner == 0) {
            delete(userdata[g.ownerID].partner)
            let kekssupport = await client.guilds.fetch('775001585541185546')
            if(kekssupport.members.cache.has(g.ownerID) && !userdata[g.ownerID].partner) {
                var member = g.owner
                member = kekssupport.member(member.user)
                let role = await kekssupport.roles.fetch('782630956619268106')
                if(!member.roles.cache.has(role)) {
                    member.roles.remove(role)
                }
            }
        }
    }
    delete(serverdata[g.id])
    fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
    console.log('Left Server:',g.name)
})

client.on('guildMemberAdd', (member) => {
    if(member.guild.id !== 775001585541185546n) return
    const userdata = require('./userdata.json')
    const VIP      = require('./VIP.json')
    if(userdata[member.id]) {
        if(userdata[member.id].partner) {
            let role = member.guild.roles.cache.find(r => r.name === "Partner")
            member.roles.add(role)
        }
    }
    if(VIP[member.id]) {
        if(VIP[member.id] == 1) {
            let role = member.guild.roles.cache.find(r => r.name === "VIP")
            member.roles.add(role)
        }
    }
    if(config.mods.includes(member.id)) {
        let role = member.guild.roles.cache.find(r => r.name === 'Moderator')
        member.roles.add(role)
    }
    if(config.devs.includes(member.id)) {
        let role = member.guild.roles.cache.find(r => r.name === 'Developer')
        member.roles.add(role)
    }
    try {
        member.user.createDM().then(channel => {
            var embed = new discord.MessageEmbed()
                .setColor(color.normal)
                .setTitle(`Willkommen, ${member.user.username}`)
                .setDescription('Herzlich Willkommen auf dem KeksBot Support Server!\n\n**Wozu ist der Server?**\nDen KeksBot Support Server gibt es, um Kekse zu essen. Sehr lecker.\nNoch dazu dient (wie der Name eigentlich schon sagen sollte) dem Support.\nAußerdem gibt es Updates und tolle Informationen zum Bot.')
                .setFooter(copyright, config.avatarURL)
                .setThumbnail(config.avatarURL)
            channel.send(embed)
        })
    } catch (err) {
    }
})

client.login(config.token)