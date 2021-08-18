const embeds = require('./embeds')
const fs = require('fs')
const path = require('path')
const discord = require('discord.js')
const delay = require('delay')
const config = require('./config.json')

const validatePermissions = (command, permissions) => {
    const validPermissions = [
        'ADMINISTRATOR',
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBER',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]
    for (const permission of permissions) {
        if(!validPermissions.includes(permission)) {
            throw new Error(`Unbekannte Berechtigung: ${permission}\nBefehl: ${command.name}`)
        }
    }
}

const getcolors = require('./subcommands/getcolor')

module.exports = async (client) => {
    client.commands = new discord.Collection()
    client.cooldowns = new discord.Collection()

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else {
                if(file.endsWith('.js') && !file.startsWith('subcmd' || 'subcommand')) {
                    var command = require(path.join(__dirname, dir, file))
                    command.path = path.join(__dirname, dir, file)
                    if(typeof command.permissions === 'string') {
                        command.permissions = [command.permissions]
                    }
                    if(command.name) {
                        console.log(`[${client.user.username}]: ${command.name} wird geladen...`)
                        if(command.permissions) validatePermissions(command, command.permissions)
                        client.commands.set(command.name, command)
                    }
                    if(!command.name && command.commands) {
                        if(typeof command.commands === 'string') command.commands = [command.commands]
                        command.name = command.commands.shift()
                        console.log(`[${client.user.username}]: ${command.name} wird geladen...`)
                        if(command.permissions) validatePermissions(command, command.permissions)
                        client.commands.set(command.name, command)
                    }
                }

            }
        }
    }
    readCommands('./commands')
    console.log(`[${client.user.username}]: Commands geladen.`)

    client.on('message', async msg => {
        if(msg.author.bot || msg.author.system || !msg.guild) return
        const serverdata = require('./serverdata.json')
        const userdata = require('./userdata.json')
        const emotes = require('./emotes.json')
        if(serverdata[msg.guild.id]) var prefix = serverdata[msg.guild.id].prefix 
        else var prefix = config.prefix
        if(msg.content.toLowerCase().startsWith(prefix.toLowerCase())) text = msg.content.substring(prefix.length)
        else if(msg.content.startsWith('<@774885703929561089>')) text = msg.content.substring(21)
        else if(msg.content.startsWith('<@!774885703929561089>')) text = msg.content.substring(22)
        else return
        text = text.trim()
        const args = text.split(/ +/)
        const commandName = args.shift().toLowerCase()
      
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.commands && cmd.commands.includes(commandName))
        if(!command) return

        if(userdata[msg.author.id] && userdata[msg.author.id].banned) return

        if(client.restarting && client.restarting >= 6000) return
        if(client.restarting) return embeds.error(msg, 'Neustart eingeleitet', 'Ein Neustart wird gerade initialisiert.\nDer Befehl wurde nicht ausgeführt.')

        if(command.permissions) {
            command.permissions.forEach(async p => {
                if(!msg.member.permissions.has(p)) {
                    if(!msg.deleted) await msg.delete().catch()
                    return embeds.needperms(p)
                }
            })
        }

        if(command.modonly && !config.mods.includes(msg.author.id)) {
            if(!msg.deleted) msg.delete().catch()
            return embeds.needperms(msg, 'KeksBot-Moderator')
        }

        if(command.devonly && !config.devs.includes(msg.author.id)) {
            if(!msg.deleted) msg.delete().catch()
            return embeds.needperms(msg, 'KeksBot-Developer')
        }

        if(command.minArgs && command.minArgs > args.length) {
            if(!msg.deleted) msg.delete().catch()
            return embeds.error(msg, 'Syntaxfehler', `Du hast zu wenig Argumente angegeben.\nBitte verwende diese Syntax:\n\`${prefix}${command.name} ${command.expectedArgs}\``)
        }

        if(command.maxArgs && command.maxArgs < args.length) {
            if(!msg.deleted) msg.delete().catch()
            return embeds.error(msg, 'Syntaxfehler', `Du hast zu viele Argumente angegeben.\nBitte verwende diese Syntax:\n\`${prefix}${command.name} ${command.expectedArgs}\``)
        }

        const { cooldowns } = client
        
        if(!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new discord.Collection())
        }
        
        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown || 0) * 1000
    
        if(timestamps.has(msg.author.id)) {
            const expirationTime = timestamps.get(msg.author.id) + cooldownAmount
        
            if(now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                if(!msg.deleted) msg.delete().catch()
                const hours = Math.floor(timeLeft / 1000 * 60 * 60)
                const minutes = Math.floor((timeLeft - hours * 1000 * 60 * 60) / 1000 * 60)
                const seconds = Math.floor((timeLeft - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000)
                const time = ''
                if(hours > 0) {
                    if(hours == 1) time += `1 Stunde `
                    else time += `${hours} Stunden `
                }
                if(minutes > 0) {
                    if(minutes == 1) time += `minutes `
                    else time += `${minutes} Minuten `
                }
                if(hours > 0 && seconds > 0 && minutes == 0) time += '0 Minuten '
                if(seconds > 0) {
                    if(seconds == 1) time += '1 Sekunde'
                    else time += `${seconds} Sekunden `
                }
                return embeds.error(msg, 'Cooldown', `Bitte warte noch ${time.trim()}, bevor du den ${command.name} hernehmen kannst.`)
            }
        }
        
        timestamps.set(msg.author.id, now)
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount)
        
        if(serverdata[msg.guild.id]) {
            var color = getcolors(msg, serverdata)
            if(serverdata[msg.guild.id].color) {
                if(serverdata[msg.guild.id].color === 'role') color.normal = msg.guild.me.displayHexColor
                else color.normal = serverdata[msg.guild.id].color
            }
            if(serverdata[msg.guild.id].ic && serverdata[msg.guild.id].ic.includes(msg.channel.id)) return
            if(serverdata[msg.guild.id].ir) {
                var temp = false
                serverdata[msg.guild.id].ir.forEach(role => {
                    if(msg.member.roles.cache.has(role)) temp = true
                })
                if(temp) return
            }
        }

        if(!color) var color = {
            red: 0xff0000,
            lightblue: 0x3498db,
            lime: 0x2ecc71,
            yellow: 0xf1c40f,
            normal: 0x00b99b
        }

        try {
            console.log(`${msg.author.tag}: ${command.name} | ${args} | ${msg.content}`)
            await command.callback(msg, args, client, serverdata, userdata, config, emotes, color, embeds)
        } catch (err) {
            console.log(`Beim Ausführen von ${command.name} durch ${msg.author.tag} ist ein Fehler aufgetreten:\n${err}\n----------------------------`)
            embeds.error(msg, 'Oh oh', `Beim Ausführen des ${command.name} Commands ist ein unbekannter Fehler aufgetreten D:\nBitte probiere es später erneut.`)
            return
        }
    })
}