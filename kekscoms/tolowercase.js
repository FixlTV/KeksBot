module.exports = {
    commands: ['tlc'],
    modonly: 1,
    type: 'unlisted',
    callback: (msg, args, client, serverdata, userdata, config, emotes, color) => {
        msg.delete()
        msg.channel.send(args.join(' ').toLowerCase())
    }
}