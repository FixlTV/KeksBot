const settings = require("../commands/admin/settings")

module.exports = (msg, serverdata) => {
    if(serverdata[msg.guild.id] && serverdata[msg.guild.id].theme) {
        var theme = serverdata[msg.guild.id].theme
        let {
            red,
            yellow,
            lime,
            lightblue
        } = theme
        var color = {
            red: red,
            yellow: yellow,
            lime: lime,
            lightblue: lightblue
        }
    } else var color = {
        red: 0xff0000,
        lightblue: 0x3498db,
        lime: 0x2ecc71,
        yellow: 0xf1c40f,
        normal: 0x00b99b
    }
    if(serverdata[msg.guild.id] && serverdata[msg.guild.id].color) {
        color.normal = serverdata[msg.guild.id].color
        if(color.normal === 'role') color.normal = msg.guild.me.displayHexColor
    } else color.normal = 0x00b99b
}