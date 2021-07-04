const config = require('../config.json')

module.exports = {
    name: 'Status',
    event: 'ready',
    once: true,
    on(client) {
        setInterval(() => {
            let statuses = [
                {
                    name: `auf ${client.guilds.cache.size} Servern`,
                    type: "PLAYING"
                },
                {
                    name: `mit ${client.users.cache.size} Nutzern`,
                    type: "PLAYING"
                },
                {
                    name: `Musik`,
                    type: "LISTENING"
                },
                {
                    name: "mit seinen Freunden",
                    type: "PLAYING"
                },
                {
                    name: `${config.version}`,
                    type: "PLAYING"
                },
                {
                    name: `auf ${client.channels.cache.size} Channels`,
                    type: "WATCHING"
                }
            ]
            let status = statuses[Math.floor(Math.random() * statuses.length)]
            client.user.setActivity(status)
        }, 20000)
    }
}