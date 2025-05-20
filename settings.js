import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botNumberCode = '' //Ejemplo: +5493812410831
global.confirmCode = ''

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  ['5493812410831', 'FERXXOBOT', true],
  ['5493812410831', 'FERXXOBOT', true],
  ['5493812410831', 'FERXXOBOT', true],
  ['5493812410831'],
  ['5493812410831'],
  ['5493812410831'],
  ['5493812410831'],
]

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.prems = []
global.APIs = {
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz',
},

  global.APIKeys = {
    'https://api.fgmods.xyz': 'm2XBbNvz' //-- 100 de límite diario --- Regístrese en https://api.fgmods.xyz/
  }

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//cambiar a true si el bot detecta sus propios comandos.
global.isBaileysFail = false
global.libreria = 'Baileys'
global.baileys = '@whiskeysockets/baileys'
global.vs = '2.0.7'
global.languaje = 'Español'
global.nameqr = 'Sisked-x'
global.namebot = '@𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔'
global.sessions = 'FERXOBOTSession'
global.jadi = 'FERXXOBOTJadiBot'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '@𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔'
global.botname = '@𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔'
global.wm = '𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 𝘉𝘰𝘵'
global.author = '@𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔'
global.dev = '𝙉𝙤𝙩 𝙈𝙮 𝙋𝙧𝙤𝙡𝙚𝙢𝙖'
global.textbot = '@𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/img/catalogo.jpg')
global.siskedurl = fs.readFileSync('./src/img/siskedurl.jpg')
global.avatar = fs.readFileSync('./src/img/avatar_contact.png')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.grupo = 'https://chat.whatsapp.com/HqhAoXS8TCcJIn0KrbJZKz'
global.channel = 'https://chat.whatsapp.com/HqhAoXS8TCcJIn0KrbJZKz'
global.channel2 = 'https://chat.whatsapp.com/HqhAoXS8TCcJIn0KrbJZKz'
global.md = 'https://wa.me/qr/PAOHAKCEHGUXN1'
global.ig = 'www.instagram.com/ineffable.mvrco'
global.tiktok = 'https://www.tiktok.com/@ineffable.mvrco'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.estilo = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5493812410831-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount: -999999, status: 1, surface: 1, message: 'Ai Otho - MD', orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net' } } }

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.esti = { key: { participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "6289643739077-1613049930@g.us" } : {}) }, message: { "videoMessage": { "title": dev, "h": `Hmm`, 'seconds': '99999', 'gifPlayback': 'true', 'caption': `Ai Otho - MD`, 'jpegThumbnail': catalogo } } }

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.multiplier = 69
global.maxwarn = '3'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
