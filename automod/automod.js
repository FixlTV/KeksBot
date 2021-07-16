const discord = require('discord.js')
const linkdetection = require('./linkdetection')

module.exports = async (client) => {
    console.log(`[${client.user.username}]: Automod aktiviert`)
    client.on('message', async (msg) => {
        var serverdata = require('../serverdata.json')
        if(msg.author.bot) return
        if(msg.author.system) return
        if(!msg.guild) return
        if(!serverdata[msg.guild.id]) return
        if(!serverdata[msg.guild.id].automod) return
        serverdata = serverdata[msg.guild.id]
        if(!serverdata.prefix) return
        if(serverdata.amconfig.links && serverdata.amconfig.links.on) linkdetection(msg, serverdata)
    })
}