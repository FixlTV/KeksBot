const fs = require('fs')

module.exports = {
    name: 'Reset Keks Cooldown',
    event: 'ready',
    once: true,
    on() {
        setInterval(() => {
            var userdata = require('../userdata.json')
            for (var k in userdata) {
                var key = k
                userdata[key].thismin = 0
            }
            var serverdata = require('../serverdata.json')
            for (var k in serverdata) {
                var key = k
                serverdata[key].thismin = 0
            }
            fs.writeFileSync('userdata.json', JSON.stringify(userdata, null, 2))
            fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
        }, 60000)
    } 
}