const fs = require('fs')

module.exports = {
    name: 'Server verlassen',
    event: 'guildDelete',
    on (g, client) {
        const serverdata = require('../serverdata.json')
        const userdata = require('../userdata.json')
        if(serverdata[g.id].partner = 1) {
            if(userdata[g.ownerID] && userdata[g.ownerID].partner) userdata[g.ownerID].partner --
            if(userdata[g.ownerID] && userdata[g.ownerID].partner && userdata[g.ownerID].partner == 0) {
                delete(userdata[g.ownerID].partner)
                try {
                    let kekssupport = client.guilds.get('775001585541185546')
                    if(kekssupport.members.cache.has(g.ownerID) && !userdata[g.ownerID].partner) {
                        var member = g.owner
                        member = kekssupport.member(member.user)
                        let role = kekssupport.roles.cache.get('782630956619268106')
                        if(!member.roles.cache.has(role)) {
                            member.roles.remove(role)
                        }
                    }
                } catch(err) {console.error}
            }
        }
        delete(serverdata[g.id])
        fs.writeFileSync('serverdata.json', JSON.stringify(serverdata, null, 2))
        console.log('Left Server: ',g.name)
    }
}