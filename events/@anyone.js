module.exports = {
    name: '@anyone',
    event: 'message',
    async on(msg, client) {
        if(!msg.guild || msg.author.sytem || msg.author.bot) return
        const serverdata = require('../serverdata.json')
        if(!serverdata[msg.guild.id]) return
        if(serverdata[msg.guild.id].anyone) {
            if(msg.content.includes('@anyone') || msg.content.includes('@anybody') || msg.content.includes('@someone') || msg.content.includes('@somebody') || msg.content.includes('@random')) {
                var member = await msg.channel.members.filter(m => !m.user.bot).random(1)
                msg.channel.send(`**${msg.author.username}** randompingt ${member}.`)
            }
    
        }
    }
}