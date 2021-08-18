const fs = require('fs')
const embeds = require('../../embeds')
const discord = require('discord.js')
const delay = require('delay')

module.exports = {
    commands: ['update', 'installupdate', 'i', 'install'],
    devonly: 1,
    description: 'Lädt ein Update von GitHub herunter und installiert dieses.',
    type: 'modonly',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        exec('git checkout main', {
            cwd: path.resolve(__dirname, '')
        })
        exec('git pull', (error, stdout, stderr) => {
            if(error) {
                embeds.error(msg, '')
                console.error('Pull fehlgeschlagen.')
                console.error(error)
                console.error('----------')
                return embeds.error(msg, 'Fehler', 'Beim Herunterladen der Daten ist ein Fehler aufgetreten.\nBitte versuche es später erneut.')
            }
            if(!stdout.toString().includes('Already up to date.')) {
                require('./sub.restartan')(msg, color, config, 'Update', 'Die Updatedateien wurden erfolgreich heruntergeladen.\nDas Update wird nun installiert.\n')
            } else {
                return embeds.error(msg, 'Keine Updates', 'Es gibt keine installierbaren Updates.')
            }
        })
    }
}