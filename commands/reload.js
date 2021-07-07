const discord = require('discord.js')
const config = require('../config.json')
const embeds = require('../embeds')
const fs = require('fs')
const path = require('path')

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

module.exports = {
    name: 'reload',
    modonly: true,
    type: 'modonly',
    description: 'Lädt Befehle neu.',
    expectedArgs: '[command]',
    async callback(msg, args, client, serverdata, userdata, config, emotes, color) {
        if(!msg.deleted) msg.delete().catch()
        if(!args[0]) {
            let text = '▶ Commands werden deaktiviert.'
            var embed = new discord.MessageEmbed()
                .setColor(color.yellow)
                .setTitle(`${emotes.pinging} Reload läuft`)
                .setDescription(`Alle Commands werden neu geladen.\nDies kann einige Zeit dauern\n\`\`\`${text}\`\`\``)
            var message = await msg.channel.send(embed)
            client.commands.array().forEach(async cmd => {
                delete require.cache[require.resolve(cmd.path)]
            })
            client.commands.clear()
            text = '✔ Commands wurden deaktiviert.\n▶ Commands werden neu geladen.'
            embed.setDescription(`Alle Commands werden neu geladen.\nDies kann einige Zeit dauern\n\`\`\`${text}\`\`\``)
            await message.edit(embed)
            async function readCommands(dir) {
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
                                if(command.permissions) validatePermissions(command, command.permissions)
                                client.commands.set(command.name, command)
                            }
                            if(!command.name && command.commands) {
                                if(typeof command.commands === 'string') command.commands = [command.commands]
                                command.name = command.commands.shift()
                                if(command.permissions) validatePermissions(command, command.permissions)
                                client.commands.set(command.name, command)
                            }
                        }
        
                    }
                }
            }
            await readCommands('.')
            return embeds.success(message, 'Reload abgeschlossen', 'Alle Commands wurden aktualisiert.', true)
        } else {
            const commandName = args[0].toLowerCase()
            const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
            if(!cmd) return embeds.error(msg, 'Unbekannter Befehl', 'Diesen Befehl gibt es nicht.')
            var embed = new discord.MessageEmbed()
                .setColor(color.yellow)
                .setTitle(`${cmd.name} wird neu geladen.`)
                .setDescription('Dies kann einige Zeit dauern.')
            var message = await msg.channel.send(embed)
            delete require.cache[require.resolve(cmd.path)]
            try {
                const newCmd = require(cmd.path)
                newCmd.path = cmd.path
                if(typeof newCmd.permissions === 'string') newCmd.permissions = [newCmd.permissions]
                if(newCmd.permissions) validatePermissions(newCmd, newCmd.permissions)
                if(typeof newCmd.commands === 'string') newCmd.commands = [newCmd.commands]
                if(!newCmd.name) newCmd.name = newCmd.commands.shift()
                client.commands.set(newCmd.name, newCmd)
            } catch (err) {
                console.log('----------------------')
                console.log('Fehler beim Reload von' + newCmd.name+ ':')
                console.error
                console.log('----------------------')
                return embeds.error(message, 'Unbekannter Fehler', 'Ein Fehler ist aufgetreten: \n```js\n   ' + err.message.slice(0, 3500) + '```', true)
            }
            return embeds.success(message, 'Reload abgeschlossen', `Der ${newCmd.name} Command wurde erfolgreich aktualisiert.`, true)
        }
    }
}