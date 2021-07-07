const fs = require('fs')
const path = require('path')

module.exports = async (client, ready) => {
    client.events = []
    const readEvents = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) {
                readEvents(path.join(dir, file))
            } else {
                if(file.endsWith('.js') && !file.startsWith('subevent')) {
                    var event = require(path.join(__dirname, dir, file))
                    if(event.event) event.event = event.event.toLowerCase()
                    event.path = path.join(__dirname, dir, file)
                    if(event.name && event.on && event.event) {
                        console.log(`[${client.user.username}]: Event ${event.name} (${event.event}) wird geladen...`)
                    }
                    if(event.on) client.events.push(event)
                }
            }
        }
    }
    if(ready) console.log(`[${client.user.username}]: Events werden geladen.`)
    readEvents('./events')
    if(ready) console.log(`[${client.user.username}]: Events geladen.`)

    client.events.forEach(event => {
        if(event.event !== 'ready') {
            if(event.once) {client.once(event.event, (...args) => event.on(...args, client))}
            else {client.on(event.event, (...args) => event.on(...args, client))}
        } else if(ready) event.on(client)
    })
}