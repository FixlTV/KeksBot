var { prefix, mods } = require('../config.json')
const embeds     = require('../embeds.js')
const config = require('../config.json')
const fs = require('fs').promises
const delay = require('delay')

const validatePermissions = (permissions) => {
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
            throw new Error(`Unbekannte Berechtigung: ${permission}`)
        }
    }
}

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        modonly = false,
        devonly = false,
        callback = () => {},
        addon = false, 
        description,
        type,
    } = commandOptions

    //Versichern, dass alle Aliases in einem Array sind
    if(typeof commands === 'string') {
        commands = [commands]
    }

    if(commands && commands[0]) console.log(`[${client.user.username}]: Lade Befehl "${commands[0]}"`)

    //Überprüfung der Permissions
    if(permissions.length) {
        if(typeof permissions === 'string') {
            permissions = [permissions]
        }
        validatePermissions(permissions)
    }

    client.on('message', msg => {
        const serverdata = require('../serverdata.json')
        const userdata   = require('../userdata.json')
        const emotes     = require('../emotes.json')

        const color = {
            red: 0xff0000,
            lightblue: 0x3498db,
            lime: 0x2ecc71,
            yellow: 0xf1c40f,
            normal: 0x00b99b
        }

        //Überprüfe ob der Autor ein Bot ist.
        if(msg.author.bot == true) return

        //Überprüfe, ob die Nachricht eine Systemnachricht ist
        if(msg.system) return

        //Überprüfe, ob die Nachricht eine DM ist.
        if(!msg.guild) {
            //Logge die DM
        	console.log(`Neue DM: ${msg.author.tag}: ${msg.content}`)
        	return
        }

        //Überprüfe, ob der Autor gebannt ist.
        if(userdata[msg.author.id]) {
            if(userdata[msg.author.id].banned) {
                return
            }
        }

        //Lege Prefix fest
        if(serverdata[msg.guild.id]) {
            prefix = serverdata[msg.guild.id].prefix
            if(serverdata[msg.guild.id].color) {
                if(serverdata[msg.guild.id].color === 'role') color.normal = msg.guild.me.displayHexColor
                else color.normal = serverdata[msg.guild.id].color
            }
        }

        if(serverdata[msg.guild.id]) {
            if(serverdata[msg.guild.id].ic && serverdata[msg.guild.id].ic.includes(msg.channel.id)) return
            if(serverdata[msg.guild.id].ir) {
                var temp = false
                serverdata[msg.guild.id].ir.forEach(role => {
                    if(msg.member.roles.cache.has(role)) temp = true
                })
                if(temp) return
            }
        }

        var text = msg.content
        if(text.toLowerCase().startsWith(prefix.toLowerCase())) text = text.substring(prefix.length)
        else if(text.startsWith('<@774885703929561089>')) text = text.substring(21)
        else if(text.startsWith('<@!774885703929561089>')) text = text.substring(22)
        else return
        text = text.trimStart()

        for(const alias of commands) {
            if(text.split(' ')[0].toLowerCase() === alias.toLowerCase()) {
                //Ein Befehl wurde detektiert.

                //Überprüfe Addons
                if(addon) {
                    let addons = {}
                    if(addons[addon]) {
                        if(!serverdata[msg.guild.id][addon]) {
                            embeds.error(msg, 'Add-On benötigt!', `Für diesen Command muss das **${addons[addon]}** Add-On aktiv sein.`)
                            return
                        }
                    } else {
                        console.log(`Unbekanntes Plugin ${addon} benötigt!`)
                    }
                }

                //Überprüfe Permissions
                for(const permission of permissions) {
                    if(!msg.member.hasPermission(permission)) {
                        msg.delete()
                        embeds.needperms(msg, permission)
                        return
                    }
                }

                //Überprüfe Mod
                if(modonly) {
                    if(mods.includes(msg.author.id)) {} else {
                        msg.delete()
                        embeds.needperms(msg, 'KeksBot-Moderator')
                        return
                    }
                }

                //Überprüfe Dev
                if(devonly) {
                    if(!config.devs.includes(msg.author.id)) {
                        msg.delete()
                        return embeds.needperms(msg, 'KeksBot-Developer')
                    }
                }

                //Füge Arguments zu einem Array hinzu
                const args = text.split(/[ ]+/)
                args.shift()

                //Überprüfe Argument Anzahl
                if(args.length < minArgs || (
                    maxArgs !== null && args.length > maxArgs
                )) {
                    msg.delete()
                    embeds.syntaxerror(msg, `${prefix}${alias} ${expectedArgs}`)
                    return
                }
                
				console.log(`${msg.author.tag}: ${alias} | ${args} | ${msg.content}`)
                //Führt den Command aus
                callback(msg, args, client, serverdata, userdata, config, emotes, color, embeds)
                delete text
                delete args
                return
            }
        }
    })
}