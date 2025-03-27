const fileType = require('file-type')

const detectFileType = async (file) => {
    const knownTextTypes = [
        { ext: 'svg', mime: 'image/svg+xml', test: (txt) => txt.includes('<svg') },
        { ext: 'csv', mime: 'text/csv', test: (txt) => txt.includes(',') && txt.includes('\n') },
        { ext: 'txt', mime: 'text/plain', test: () => true }, // fallback para texto plano
        { ext: 'html', mime: 'text/html', test: (txt) => txt.includes('<!DOCTYPE html') || txt.includes('<html') },
        { ext: 'json', mime: 'application/json', test: (txt) => {
          try { JSON.parse(txt); return true; } catch { return false; }
        }},
        { ext: 'xml', mime: 'application/xml', test: (txt) => txt.includes('<?xml') },
    ];
    
    // 1. Intentar detectar con file-type
    const detected = await fileType.fromBuffer(file.data);
    let ext = null;
    let mime = null;

    if (detected && detected.ext !== 'xml') {
        ext = detected.ext;
        mime = detected.mime;
    } else {
        const text = file.data.toString('utf8');
        for (const type of knownTextTypes) {
            if (type.test(text)) {
            ext = type.ext;
            mime = type.mime;
            break;
            }
        }

        if (!ext) {
            ext = file.name?.split('.').pop() || 'bin';
            mime = file.mimetype || 'application/octet-stream';
        }
    }

    const category = getCategory(mime, ext);
    
    // 4. Fallback: usar nombre y mimetype si todo falla
    return { ext, mime, category };
}

// Clasificador de categorías
const getCategory = (mime, ext) => {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';

    if (['pdf', 'doc', 'docx', 'odt', 'txt', 'rtf'].includes(ext)) return 'document';
    if (['csv', 'json', 'xml', 'xls', 'xlsx'].includes(ext)) return 'data';
    if (['html', 'js', 'ts', 'css', 'scss'].includes(ext)) return 'code';

    if (mime.startsWith('text/')) return 'document';
    if (mime.startsWith('application/')) return 'data';

    return 'binary';
}

module.exports = {
    detectFileType
}