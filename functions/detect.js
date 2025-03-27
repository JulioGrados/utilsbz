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
    if (detected && detected.ext !== 'xml') {
        return detected;
    }

    // 2. Convertir a texto para detecciones manuales
    const text = file.data.toString('utf8');

    // 3. Verificar tipos conocidos de texto
    for (const type of knownTextTypes) {
        if (type.test(text)) {
            return { ext: type.ext, mime: type.mime };
        }
    }
    
      // 4. Fallback: usar nombre y mimetype si todo falla
    return {
        ext: file.name?.split('.').pop() || 'bin',
        mime: file.mimetype || 'application/octet-stream'
    };
}

module.exports = {
    detectFileType
}