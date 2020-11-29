const { sign } = require('crypto')
const discord = require('discord.js')
const client  = new discord.Client
const fs      = require('fs')
const config  = JSON.parse(fs.readFileSync('./config.json', null, 2))
const embeds  = require('./embeds')
const ext1    = require('./extern1')
const extern2 = require('./extern2')
const ext2    = require('./extern2')
const serverdata = require('./serverdata.json')

client.on('ready', () => {
    console.log(`[${client.user.username}]: Lade Kekse...`)
    console.log(`[${client.user.username}]: Kekse geladen!`)
})


cmds = {
    tellraw: cmd_tellraw,
    test: cmd_test,
    testfor: cmd_testfor,
    addvip: cmd_addvip,
    removevip: cmd_rmvvip,
    testvip: cmd_testvip,
    eval: cmd_eval,
    badges: ext_badge,
    kekse: ext_kekse,
    cookies: ext_kekse,
    addserver: ext_addserver,
    activate: cmd_activate,
    help: ext_help,
    ping: ext_ping,
    eat: ext_eat,
    addme: ext_eat,
    partner: ext_partner
}

function cmd_tellraw(msg, args) {
    msg.delete(),
    msg.channel.send(args.join(' '))
}

function cmd_test(msg) {
    if (config.mods.includes(msg.author.id)) {
        msg.react(msg.guild.emojis.cache.get('775004072465399848'))
        console.log(`${msg.author.username} führt einen Test aus.`)
        msg.delete({ timeout: 3000 })
    } else {
        msg.react(msg.guild.emojis.cache.get('775004095056052225'))
        msg.delete({ timeout: 3000 })
    }
}

function cmd_testfor(msg, args) {
    if (config.mods.includes(msg.author.id)) {
        msg.channel.send(`\`\`${args.join(' ')}\`\``)
        msg.delete()
    } else {
        msg.react(msg.guild.emojis.cache.get('775004095056052225'))
        msg.delete({ timeout: 3000 })
    }
}

function cmd_addvip(msg, args) {
    if((config.mods.includes(msg.author.id))) {
        if(!isNaN(args)) { 
            var VIPs = JSON.parse(fs.readFileSync('./VIP.json', null, 2))
            VIPs[args] = 1
            fs.writeFileSync('./VIP.json',JSON.stringify(VIPs, null, 2))
            msg.delete()
            embeds.success(msg, 'Daten gespeichert!', `<@${args}> wurde als VIP registriert.`)
            console.log(`${msg.author.username}: ${args} ist nun VIP.`)
        } else {
            msg.delete()
            embeds.error(msg, "Fehler", `\`${args.join(' ')}\` ist keine gültige ID.`)
        }
    } else {
        msg.delete()
        embeds.needperms(msg, 'BOT-MODERATOR')
    }
}

function cmd_rmvvip(msg, args) {
    if((config.mods.includes(msg.author.id))) {
        if(!isNaN(args)) { 
            var VIPs = JSON.parse(fs.readFileSync('./VIP.json', null, 2))
            delete VIPs[args]
            fs.writeFileSync('./VIP.json',JSON.stringify(VIPs, null, 2))
            msg.delete()
            embeds.success(msg, 'Daten gespeichert!', `<@${args}> ist kein VIP mehr.`)
            console.log(`${msg.author.username}: ${args} ist kein VIP mehr.`)
        } else {
            msg.delete()
            embeds.error(msg, "Fehler", `\`${args.join(' ')}\` ist keine gültige ID.`)
        }
    } else {
        msg.delete()
        embeds.needperms(msg, 'BOT-MODERATOR')
    }
}

function cmd_testvip(msg, args) {
    if((config.mods.includes(msg.author.id))) {
        if(!isNaN(args)) { 
            VIPs = JSON.parse(fs.readFileSync('./VIP.json', null, 2))
            msg.delete()
            if(args in VIPs) {
                if(VIPs[args] == 1) {
                    embeds.success(msg, "Test erfolgreich", `<@${args}> ist VIP.`)
                } else {
                    embeds.error(msg, "Test fehlgeschlagen", `<@${args}> ist kein VIP.`)
                }
            } else {
                embeds.error(msg, "Test fehlgeschlagen", `<@${args}> ist kein VIP.`)
            }
        } else {
            msg.delete()
            embeds.error(msg, "Fehler", `\`${args.join(' ')}\` ist keine gültige ID.`)
        }
    } else {
        msg.delete()
        embeds.needperms(msg, 'BOT-MODERATOR')
    }
}

function cmd_eval(msg, args) {
    if(config.devs.includes(msg.author.id)) {
        msg.delete()
        try {
            eval(args.join(' '))
        } catch(err) {
            embeds.error(msg, "Fehler", `\`\`\`${err}\`\`\``)
        }
    }
}

function ext_badge(msg) {
    msg.delete()
    ext1.badge(msg, client.user.avatarURL())
}

function ext_kekse(msg, args) {
    ext2.kekse(msg, args, client)
}

function cmd_activate(msg) {
    const serverdata = require('./serverdata.json')
    msg.delete()
    if((msg.member.hasPermission('ADMINISTRATOR')) && !serverdata[msg.guild.id]) {
        try {
            serverdata[msg.guild.id] = {}
            serverdata[msg.guild.id].thismin = 0
            serverdata[msg.guild.id].lv = 1
            serverdata[msg.guild.id].xp = 0
            fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
            embeds.success(msg, 'Daten angelegt!', 'Alle erforderlichen Daten wurden angelegt.\nDas System ist nun bereit.')
        } catch (err) {
            embeds.error(msg,'Fehler',err,"\nBitte wende dich an ein Teammitglied, um dieses Problem zu melden.")
        }
    } else {
        embeds.error(msg, "Aktivierung unmöglich", "Entweder du bist nicht berechtigt, diesen Befehl auszuführen, oder das System ist auf diesem Server bereits aktiv.")
    }
}

function ext_addserver(msg, args) {
    extern2.addserver(msg, args, client.user.avatarURL())
}

function ext_help(msg) {
    ext1.help(msg, client.user.avatarURL())
}

function ext_ping(msg) {
    ext1.ping(msg, client)
}

function ext_eat(msg, args) {
    ext2.eat(msg, args, client.user.avatarURL())
}

function ext_partner(msg) {
    ext1.partner(msg, client)
}

client.on('message', (msg) => {
    var content = msg.content,
        author  = msg.member

    if(!msg.guild) return

    if(author.bot = true && content.startsWith(config.prefix)) {
            
        var invoke = content.split(' ')[0].substring(config.prefix.length)
        var args   = content.split(' ').slice(1)
        }
        
        if(invoke in cmds) {
            cmds[invoke](msg, args)
        }
})

client.on('guildCreate', (g) => {
    embed = new discord.MessageEmbed()
        .setColor(0xf1c40f)
        .setTitle('<:cookie:776460440477630465> Daten werden angelegt...')
        .setDescription('Vielen Dank, dass ich diesen Server besuchen darf.\nUm die Keksbot Funktionen zu aktivieren, lege ich mal ein paar kleine Daten an...\nDies kann einige Zeit dauern.')
    g.systemChannel.send('',embed).then(resultmsg => {
    const serverdata = require('./serverdata.json')
    try {
        serverdata[g.id] = {}
        serverdata[g.id].thismin = 0
        serverdata[g.id].lv = 1
        serverdata[g.id].xp = 0
        fs.writeFileSync('serverdata.json',JSON.stringify(serverdata, null, 2))
        embed = new discord.MessageEmbed()
            .setColor(0x2ecc71)
            .setTitle('<:accept:775004072465399848> Daten erfolgreich angelegt.')
            .setDescription('Alle nötigen Daten wurden erfolgreich angelegt.\nDas System ist nun bereit!\nViel Spaß beim Kekse essen!')
        resultmsg.edit('',embed).then(msg => msg.delete({ timeout: 10000 }))
    } catch (err) {
        console.log('Failed creating data for server:',g.id)
        console.log('----------------------')
        console.log(err)
        console.log('----------------------')
        console.log(serverdata)
        console.log('----------------------')
        console.log(g.id)
        embed = new discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle('<:denied:775004095056052225> Fehler')
            .setDescription('Beim Anlegen der Daten ist ein Fehler aufgetreten.\nBitte gib ``-activate`` ein, um das System manuell zu aktivieren.\nWir entschuldigen uns für diese Unannehmlichkeiten.')
        resultmsg.edit('',embed).then(msg => msg.delete({ timeout: 10000 }))
    }})
})

client.on('guildDelete', (g) => {
    const serverdata = require('./serverdata.json')
    const userdata = require('./userdata.json')
    if(serverdata[g.id].partner = 1) {
        userdata[g.ownerID].partner = userdata[g.ownerID].partner -1
        if(userdata[g.ownerID].partner == 0) {
            delete(userdata[g.ownerID].partner)
        }
    }
    delete(serverdata[g.id])
    fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
    console.log('Left Server:',g.name)
})

client.login(config.token)