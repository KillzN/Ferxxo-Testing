import fs from 'fs';
import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatosAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const DB_PATH = './src/database/db_audios.json';  // ajusta según tu estructura

// Funciones para manejar la DB JSON
function leerDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, '{}');
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data || '{}');
  } catch {
    return {};
  }
}

function escribirDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

const ddownr = {
  descargar: async (url, formato) => {
    if (!formatosAudio.includes(formato)) {
      throw new Error('Formato no soportado, verifica la lista de formatos disponibles.');
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${formato}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      const response = await axios.request(config);

      if (response.data && response.data.success) {
        const { id, title, info } = response.data;
        const { image } = info;
        const downloadUrl = await ddownr.verificarProgreso(id);

        return {
          id: id,
          image: image,
          title: title,
          downloadUrl: downloadUrl
        };
      } else {
        throw new Error('Fallo al obtener los detalles del video.');
      }
    } catch (error) {
      console.error('Error al intentar obtener el audio desde la primera API:', error);
      return await ddownr.obtenerAudioDeRespaldo(url);
    }
  },
  verificarProgreso: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);

        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error al verificar el progreso:', error);
      throw error;
    }
  },

  obtenerAudioDeRespaldo: async (url) => {
    try {
      const api = await (await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=audio&quality=128kbps&apikey=GataDios`)).json();
      const result = api.data.url;
      return { downloadUrl: result };
    } catch (error) {
      console.error('Error al obtener el audio desde la API de respaldo:', error);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `Ingresa el nombre de la música que deseas descargar.`, m);
    }

    // Leer DB
    let db = leerDB();

    // Buscar en DB cache por texto exacto (puedes mejorar con otros métodos)
    if (db[text]) {
      const info = db[text];
      const mensajeTexto = `🎵 *${info.title || 'Título desconocido'}*\n` +
        `👁️‍🗨️ ${info.views || '0'} vistas\n` +
        `🕒 ${info.ago || 'Fecha desconocida'}\n` +
        `🔗 ${info.url || ''}\n\n` +
        `_Audio enviado por Dj Huevito_`;

      // Descargar miniatura
      let thumbBuffer = null;
      try {
        if (info.thumbnail) {
          const response = await fetch(info.thumbnail);
          thumbBuffer = await response.arrayBuffer();
        }
      } catch { }

      if (thumbBuffer) {
        await conn.sendMessage(m.chat, {
          image: Buffer.from(thumbBuffer),
          caption: mensajeTexto
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, { text: mensajeTexto }, { quoted: m });
      }

      await conn.sendMessage(m.chat, { audio: { url: info.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m });
      return;
    }


    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;

    const infoMessage = `> 𝙴𝙽𝚅𝙸𝙰𝙽𝙳𝙾 𝙿𝙴𝙳𝙸𝙳𝙾.`;
    const thumb = (await conn.getFile(thumbnail))?.data;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: `${views} vistas • ${ago}`,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (command === 'play') {
      const downloadInfo = await ddownr.descargar(url, 'mp3');
      const downloadUrl = downloadInfo.downloadUrl;

      // Guardar en DB
      db[text] = {
        downloadUrl,
        title,
        thumbnail,
        timestamp,
        views,
        ago,
        url
      };
      escribirDB(db);

      await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m });
    } else {
      throw "Comando no reconocido.";
    }
  } catch (error) {
    return m.reply(`⚠ Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ['play'];
handler.tags = ['downloader'];

export default handler;
