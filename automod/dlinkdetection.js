const discord = require('discord.js')
const delay = require('delay')
const linkify = require('linkifyjs')
const check = require('check-links')

module.exports = async (msg, serverdata) => {
    var text = msg.content.replace(/\`{3}([\S\s]*?)\`{3}/g, '')
    var links = linkify.find(text, 'url')
    console.log(0)
    // if(msg.member.hasPermission('MANAGE_MESSAGES')) return
    if(!serverdata.amconfig.dlinks) return
    if(serverdata.amconfig.dlinks.invite) {
        if(serverdata.amconfig.dlinks.invite == 1) {
            let skip = false
            if(serverdata.amconfig.links) {
                serverdata.amconfig.links.rolewl.forEach(role => {
                    if(msg.member.roles.cache.has(role)) skip = true
                })
                if(serverdata.amconfig.links.channelwl.includes(msg.channel.id)) skip = true
            }
            if(!skip) {
                let invites = await msg.guild.fetchInvites().catch(err => {return})
                let possibleinvites = []
                links.forEach(link => {
                    if((link.href.replace('www.', '').replace('https://', '').replace('http://', '').startsWith('discord.gg/') || link.href.replace('www.', '').replace('https://', '').replace('http://', '').startsWith('discord.com/invite/')) && !(link.href.endsWith('discord.gg/') || link.href.endsWith('discord.com/invite/'))) possibleinvites.push(link.href)})
                var illegalinvites = []
                possibleinvites.forEach(async inv => {
                    let checked = await check([inv])
                    let result = checked[inv]
                    if(result.status === 'alive') {
                        if(!invites.has(inv.replace('www.', '').replace('https://', '').replace('http://', '').replace('discord.gg/', '').replace('discord.com/invite/', ''))) illegalinvites.push(inv)
                    }
                    if(illegalinvites.length > 0) {
                        if(msg.content.startsWith(require('../config.json').prefix) || msg.content.startsWith(serverdata.prefix)) await delay(500)
                        if(!msg.deleted) return msg.delete({reason: 'AutoMod: Nachricht enthält Servereinladungen.'}).catch()
                    }
                })
            }
        } else {
            let invites = await msg.guild.fetchInvites().catch(err => {return})
            let possibleinvites = []
            links.forEach(link => {
                if((link.href.replace('www.', '').replace('https://', '').replace('http://', '').startsWith('discord.gg/') || link.href.replace('www.', '').replace('https://', '').replace('http://', '').startsWith('discord.com/invite/')) && !(link.href.endsWith('discord.gg/') || link.href.endsWith('discord.com/invite/'))) possibleinvites.push(link.href)})
            var illegalinvites = []
            possibleinvites.forEach(async inv => {
                let checked = await check([inv])
                let result = checked[inv]
                if(result.status === 'alive') {
                    if(!invites.has(inv.replace('www.', '').replace('https://', '').replace('http://', '').replace('discord.gg/', '').replace('discord.com/invite/', ''))) illegalinvites.push(inv)
                }
                if(illegalinvites.length > 0) {
                    if(msg.content.startsWith(require('../config.json').prefix) || msg.content.startsWith(serverdata.prefix)) await delay(500)
                    if(!msg.deleted) return msg.delete({reason: 'AutoMod: Nachricht enthält Servereinladungen.'}).catch()
                }
            })        
        }
        if(serverdata.amconfig.dlinks.message) {
            if(serverdata.amconfig.dlinks.message == 1) {
                let skip = false
                if(serverdata.amconfig.links) {
                    serverdata.amconfig.links.rolewl.forEach(role => {
                        if(msg.member.roles.cache.has(role)) skip = true
                    })
                    if(serverdata.amconfig.links.channelwl.includes(msg.channel.id)) skip = true
                }
                if(!skip) {
                    var temp = true
                    var linkarray = []
                    links.forEach(link => linkarray.push(link.href))
                    console.log(linkarray)
                    linkarray.forEach(async (l) => {
                        let checked = await check([l])
                        let result = checked[l]
                        console.log(result)
                        if(result.status === 'alive') {
                            let substring = l.split('channels/')[1].split('/')[0]
                            console.log(substring)
                            console.log('775001585541185546')
                            if(substring !== msg.guild.id) temp = false
                            if(msg.content.startsWith(require('../config.json').prefix) || msg.content.startsWith(serverdata.prefix)) await delay(500)
                            if(!msg.deleted) return msg.delete({reason: 'AutoMod: Nachricht enthält Nachrichtenlinks zu anderen Servern.'}).catch()        
                        }
                    })
                    if(!temp) return
                }
            } else {
                var temp = true
                var linkarray = []
                links.forEach(link => linkarray.push(link.href))
                console.log(linkarray)
                linkarray.forEach(async (l) => {
                    let checked = await check([l])
                    let result = checked[l]
                    console.log(result)
                    if(result.status === 'alive') {
                        let substring = l.split('channels/')[1].split('/')[0]
                        console.log(substring)
                        console.log('775001585541185546')
                        if(substring !== msg.guild.id) temp = false
                        if(msg.content.startsWith(require('../config.json').prefix) || msg.content.startsWith(serverdata.prefix)) await delay(500)
                        if(!msg.deleted) return msg.delete({reason: 'AutoMod: Nachricht enthält Nachrichtenlinks zu anderen Servern.'}).catch()        
                    }
                })
                if(!temp) return
            }
        }
    }
}