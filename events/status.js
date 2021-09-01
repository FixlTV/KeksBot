const config = require('../config.json')

function changeStatus(client) {
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
            name: `Version ${config.version}`,
            type: "PLAYING"
        },
        {
            name: `auf ${client.channels.cache.size} Channels`,
            type: "WATCHING"
        }
    ]
    let status = statuses[Math.floor(Math.random() * statuses.length)]
    if(client.user.presence.activities[0] && client.user.presence.activities[0].name === status.name) changeStatus(client)
    else client.user.setActivity(status)
}

module.exports = {
    name: 'Status',
    event: 'ready',
    async on(client) {
        changeStatus(client)
        setInterval(() => {
            changeStatus(client)
        }, 20000)
    }
}