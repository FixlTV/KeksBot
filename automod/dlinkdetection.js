const discord = require('discord.js')
const delay = require('delay')
const linkify = require('linkifyjs')
const check = require('check-links')

module.exports = async (msg, serverdata) => {
    var text = msg.content.replace(/\`{3}([\S\s]*?)\`{3}/g, '')
    var links = linkify.find(text, 'url')
    if(msg.member.hasPermission('MANAGE_MESSAGES')) return
    var temp = false
    if(!serverdata[msg.guild.id].amconfig.dlinks) return
    if(serverdata[msg.guild.id].amconfig.dlinks.invite) {
        if(serverdata[msg.guild.id].amconfig.dlinks.invite == 1) {
            
        }
    }
}