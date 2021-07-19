module.exports = {
    name: 'checkpermissions',
    commands: ['checkperms', 'perms', 'permissions'],
    permission: 'ADMINISTRATOR',
    type: 'admin',
    description: 'Überprüft die Berechtigungen des Bots. Sinnvoll, wenn Fehler beim ausführen mancher Commands auftreten.',
    async callback(msg, args, client, serverdata, userdata, config, emotes, color) {
        let deleteMessages = msg.guild.me.hasPermission('DELETE_MESSAGES')
        /*
            Hewwu lieber Leser,
            Wenn du diesen Text NACH dem 25.07.2021 im neusten Commit siehst,
            zögere bitte nicht mich auf Discord mit Pings volzuspammen.
            Vielen Dank :3
        */
    }
}