const fs = require('fs')
const embeds = require('../../embeds')
const discord = require('discord.js')
const delay = require('delay')
const embeds = require('../../embeds')

module.exports = {
    commands: ['pull', 'git_pull', 'gitpull', 'loadupdate', 'download'],
    devonly: 1,
    description: 'Lädt ein Update von GitHub herunter.',
    type: 'modonly',
    callback: async (msg, args, client, serverdata, userdata, config, emotes, color) => {
        exec('git checkout main', {
            cwd: path.resolve(__dirname, '')
        })
        exec('git pull', (error, stdout, stderr) => {
            if(error) {
                console.error('Pull fehlgeschlagen.')
                console.error(error)
                console.error('----------')
            }
            if(!stdout.toString().includes('Already up to date.')) {
                embeds.success(msg, 'Update herunter geladen', 'Alle Daten wurden erfolgreich heruntergeladen.\nDas Update ist nun bereit zur Installation.')
            } else {
                embeds.error(msg, 'Keine Updates', 'Alle Daten sind bereits auf dem neuesten Stand.')
            }
        })
    }
}