const fs = require('fs').promises

const setup = async () => {
    console.clear()
    console.log('Willkommen beim KeksBot Setup')
    console.log('')
    console.log('Alle benötigten Daten werden angelegt...')
    console.log('')

    //userdata Setup
    var userdata = await fs.access('./userdata.json').catch(async err => {
        console.log('userdata.json wird angelegt...')
        userdata = {}
        await fs.writeFile('userdata.json', JSON.stringify(userdata, null, 2))
        console.log('✅ Datei angelegt.')
        console.log('')
    })


    //serverdata Setup
    var serverdata = await fs.access('serverdata.json').catch(async err => {
        console.log('serverdata.json wird angelegt...')
        serverdata = {}
        await fs.writeFile('serverdata.json', JSON.stringify(serverdata, null, 2))
        console.log('✅ Datei angelegt.')
        console.log('')      
    })

    //vip Setup
    var VIP = await fs.access('VIP.json').catch(async err => {
        console.log('VIP.json wird angelegt...')
        VIP = {}
        await fs.writeFile('VIP.json', JSON.stringify(VIP, null, 2))
        console.log('✅ Datei angelegt.')
        console.log('')
    })

    var data = await fs.access('data.json').catch(async err => {
        console.log('data.json wird angelegt...')
        data = {
            case: 0,
            request: 0
        }
        await fs.writeFile('data.json', JSON.stringify(data, null, 2))
        console.log('✅ Datei angelegt.')
        console.log('')
    })

    //config Setup
    var config = await fs.access('config.json').catch(async err => {
        console.log('config.json wird angelegt...')
        config = {
            token: "Hier Token einfügen",
            prefix: "-",
            mods: [],
            devs: [],
            version: "0.1",
            max: 128,
            maxVIP: 512,
            maxP: 256,
            maxlv1: 512,
            maxlv2: 1024,
            maxlv3: 2048,
            maxlv4: 4096,
            maxlv5: 8192,
            maxPartner: 16384,
            lv2: 2048,
            lv3: 8192,
            lv4: 32768,
            lv5: 131072,
            Partner: 1048576,
            mPartnerNeed: 10,
            support: 1,
            avatarURL: "https://cdn.discordapp.com/avatars/774885703929561089/ecd2914a28f52fba1962c962165877ae.webp",
            tan: "0000-0000"
        }
        await fs.writeFile('config.json', JSON.stringify(config, null, 2))
        console.log('✅ Datei angelegt.')
        console.warn('Es wurde noch kein Token eingegeben. Bitte ersetze den Token Wert in der config.json durch deinen Bot-Token.')
        console.log('')
    })
    setTimeout(async () => {
        console.log('Das Setup wurde erfolgreich abgeschlossen.')
        console.log('Starte den Bot mit \'npm start\' oder \'node index\'.')
    }, 1000)
}

setup()