const fs = require('fs')
const path = require('path')

module.exports = (client) => {
    const handler = 'cmdhandler.js'
    const commandBase = require(`./${handler}`)
    const commands = new Array()

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if(file !== handler && file !== 'cmdloader.js') {
                const option = require(path.join(__dirname, dir, file))
                commands.push(option)
                if(client) {
                    commandBase(client, option)
                }
            }
        }
    }

    if (client) console.log(`[${client.user.username}]: Lade Commands...`)
    readCommands('.')
    if (client) console.log(`[${client.user.username}]: System aktiviert!...`)
    return commands
}