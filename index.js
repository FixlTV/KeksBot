const discord = require('discord.js')
const client  = new discord.Client
const fs      = require('fs')
const config  = JSON.parse(fs.readFileSync('./config.json'))
const embeds  = require('./embeds')
const ext1    = require('./extern1')
const ext2    = require('./extern2')

client.on('ready', () => {
    console.log(`[${client.user.username}]: Kekse wurden geladen.`)
})


cmds = {
    tellraw: cmd_tellraw,
    test: cmd_test,
    testfor: cmd_testfor,
    addvip: cmd_addvip,
    removevip: cmd_rmvvip,
    testvip: cmd_testvip,
    eval: cmd_eval,
    badges: ext_badge
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
            embeds.success(msg, ':white_check_mark: Daten gespeichert!', `<@${args}> wurde als VIP registriert.`)
            console.log(`${msg.author.username}: ${args} ist nun VIP.`)
        } else {
            msg.delete()
            embeds.error(msg, ":x: Fehler", `\`${args.join(' ')}\` ist keine gültige ID.`)
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
            embeds.success(msg, ':white_check_mark: Daten gespeichert!', `<@${args}> ist kein VIP mehr.`)
            console.log(`${msg.author.username}: ${args} ist kein VIP mehr.`)
        } else {
            msg.delete()
            embeds.error(msg, ":x: Fehler", `\`${args.join(' ')}\` ist keine gültige ID.`)
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
                    embeds.success(msg, ":white_check_mark: Test erfolgreich", `<@${args}> ist VIP.`)
                } else {
                    embeds.error(msg, ":x: Test fehlgeschlagen", `<@${args}> ist kein VIP.`)
                }
            } else {
                embeds.error(msg, ":x: Test fehlgeschlagen", `<@${args}> ist kein VIP.`)
            }
        } else {
            msg.delete()
            embeds.error(msg, ":x: Fehler", `\`${args.join(' ')}\` ist keine gültige ID.`)
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
            embeds.error(msg, ":x: Fehler", `\`\`\`${err}\`\`\``)
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

client.on('message', (msg) => {
    var content = msg.content,
        author  = msg.member

    if(author.bot = true && content.startsWith(config.prefix)) {
            
        var invoke = content.split(' ')[0].substring(config.prefix.length)
        var args   = content.split(' ').slice(1)
        }
        
        if(invoke in cmds) {
            cmds[invoke](msg, args)
        }
})

client.on('guildCreate', (g) => {
    var serverdata = JSON.parse(fs.readFileSync('./serverdata.json'), null, 2)
    serverdata.thismin[g.id] = 0
    serverdata.lv[g.id] = 0
    serverdata.xp[g.id] = 0
    fs.writeFileSync('./serverdata.json',JSON.stringify(serverdata, null, 2))
    console.log('Joined Server:',g.name)
})

client.on('guildDelete', (g) => {
    var serverdata = JSON.parse(fs.readFileSync('./serverdata.json'))
    delete(serverdata.thismin[g.id])
    delete(serverdata.lv[g.id])
    delete(serverdata.xp[g.id])
    fs.writeFileSync('./serverdata.json', JSON.stringify(serverdata, null, 2))
    console.log('Left Server:',g.name)
})

client.login(config.token)
