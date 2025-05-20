import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const fetchWithTimeout = async (url, timeout = 5000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.buffer(); // Devuelve la imagen como buffer
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    return null;
  } finally {
    clearTimeout(timer); // Limpia el temporizador
  }
};

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let pp = 'https://i.ibb.co/1tqw7YW3/Tenamore.jpg'; // Imagen por defecto si no se obtiene la imagen de perfil
  let img;

  try {
    // Intentamos obtener la imagen de perfil del usuario
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => pp);
    img = await fetchWithTimeout(pp); // Usamos la función con tiempo de espera
  } catch (error) {
    console.error('Error al obtener la imagen de perfil:', error);
    img = await fetchWithTimeout('https://i.ibb.co/1tqw7YW3/Tenamore.jpg'); // Si falla, usamos la imagen predeterminada
  }

  let chat = global.db.data.chats[m.chat];
  let welcome = '';
  let bye = '';

  // Bienvenida
  if (chat.bienvenida && m.messageStubType == 27) {
    if (chat.sWelcome) {
      let user = `@${m.messageStubParameters[0].split`@`[0]}`;
      welcome = chat.sWelcome
        .replace('@user', user)
        .replace('@group', groupMetadata.subject)
        .replace('@desc', groupMetadata.desc || 'sin descripción');
    } else {
      let user = `@${m.messageStubParameters[0].split`@`[0]}`;
      welcome = `👋🏻 𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐨/𝐚\n👤: ${user}\n💢 𝙶𝚛𝚞𝚙𝚘: ${groupMetadata.subject}\n📩 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚌𝚒𝚘́𝚗:\n🩸 ${groupMetadata.desc || '𝚂𝚒𝚗 𝚍𝚎𝚜𝚌𝚛𝚒𝚙𝚌𝚒𝚘́𝚗.'}\n\n> KILL BOT 🔥`;
    }

    let message = {
      caption: welcome,
      mentions: [m.messageStubParameters[0]],
      contextInfo: {
        mentionedJid: [m.messageStubParameters[0]],
        externalAdReply: {
          title: packname,
          body: dev,
          mediaUrl: pp,
          mediaType: 2,
          thumbnailUrl: 'https://i.ibb.co/RTW0k9qC/Ferxxo.jpg',
          thumbnail: img
        }
      },
      image: img,
    };

    await conn.sendMessage(m.chat, message, { quoted: m });
  }

  // Despedida
  if (chat.bienvenida && m.messageStubType == 28) {
    if (chat.sBye) {
      let user = `@${m.messageStubParameters[0].split`@`[0]}`;
      bye = chat.sBye
        .replace('@user', user)
        .replace('@group', groupMetadata.subject)
        .replace('@desc', groupMetadata.desc || 'sin descripción');
    } else {
      let user = `@${m.messageStubParameters[0].split`@`[0]}`;
      bye = `👋🏻 *𝐂𝐡𝐚𝐨𝐨*\n👤: ${user}\n🤷🏻‍♂️ 𝐔𝐧𝐚 𝐛𝐚𝐬𝐮𝐫𝐚 𝐦𝐞𝐧𝐨𝐬 😮‍💨🖕🏼\n\n> KILL BOT 🔥`;
    }

    let message = {
      caption: bye,
      mentions: [m.messageStubParameters[0]],
      contextInfo: {
        mentionedJid: [m.messageStubParameters[0]],
        externalAdReply: {
          title: packname,
          body: dev,
          mediaUrl: pp,
          mediaType: 2,
          thumbnailUrl: 'https://i.ibb.co/RTW0k9qC/Ferxxo.jpg',
          thumbnail: img
        }
      },
      image: img,
    };

    await conn.sendMessage(m.chat, message, { quoted: m });
  }
}
