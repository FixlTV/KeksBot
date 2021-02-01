var { prefix, mods } = require('../config.json')
const embeds     = require('../embeds.js')
const config = require('../config.json')
const fs = require('fs')

const color = {
    red: 0xff0000,
    lightblue: 0x3498db,
    lime: 0x2ecc71,
    yellow: 0xf1c40f,
    normal: 0x00b99b
}

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
        modonly = 0,
        callback,
        addon = false, 
        description,
        type,
    } = commandOptions

    //Versichern, dass alle Aliases in einem Array sind
    if(typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`[${client.user.username}]: Lade Befehl "${commands[0]}"`)

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
            if(userdata[msg.author.id].banned == 1) {
                return
            }
        }

        //Lege Prefix fest
        if(serverdata[msg.guild.id]) {
            prefix = serverdata[msg.guild.id].prefix
        }
        for(const alias of commands) {
            if(msg.content.split(' ')[0].toLowerCase() === `${prefix.toLowerCase()}${alias.toLowerCase()}` || (msg.content.split(' ')[0].toLowerCase() === `<@!774885703929561089>` && msg.content.split(' ')[1] &&msg.content.split(' ')[1].toLowerCase() === `${alias.toLowerCase()}`)) {
                //Ein Befehl wurde detektiert.

                //Überprüfe Permissions
                for(const permission of permissions) {
                    if(!msg.member.hasPermission(permission)) {
                        msg.delete()
                        embeds.needperms(msg, permission)
                        return
                    }
                }

                //Überprüfe Addons
                if(addon) {
                    let addons = {
                        'mod': 'Moderation'
                    }
                    if(addons[addon]) {
                        if(!serverdata[msg.guild.id][addon]) {
                            embeds.error(msg, 'Add-On benötigt!', `Für diesen Command muss das **${addons[addon]}** Add-On aktiv sein.`)
                            return
                        }
                    } else {
                        console.log
                    }
                }

                //Überprüfe Mod
                if(modonly == 1) {
                    if(mods.includes(msg.author.id)) {} else {
                        msg.delete()
                        embeds.needperms(msg, 'KeksBot-Moderator')
                        return
                    }
                }
                //Füge Arguments zu einem Array hinzu
                const args = msg.content.split(/[ ]+/)
                args.shift()
                if(args[0].toLowerCase() === alias.toLowerCase()) {
                    args.shift()}

                //Überprüfe Argument Anzahl
                if(args.length < minArgs || (
                    maxArgs !== null && args.length > maxArgs
                )) {
                    msg.delete()
                    embeds.syntaxerror(msg, `${prefix}${alias} ${expectedArgs}`)
                    return
                }
	
				console.log(`Command ${alias} wird ausgeführt.`)
                //Führt den Command aus
                callback(msg, args, client, serverdata, userdata, config, emotes, color, embeds) 

                return
            }
        }
    })
}
