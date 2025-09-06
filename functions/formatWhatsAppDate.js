const moment = require('moment');
require('moment/locale/es'); // Para español

// Configurar momento en español
moment.locale('es');

const parseISODate = (isoString) => {
    // Si viene como ISODate('2025-07-30T12:58:50.077Z'), extraer el string interno
    let cleanISOString = isoString;

    if (typeof isoString === 'string' && isoString.includes('ISODate(')) {
        // Extraer solo la fecha del formato ISODate('...')
        const match = isoString.match(/ISODate\('(.+)'\)/);
        if (match) {
            cleanISOString = match[1];
        }
    }

    return moment(cleanISOString);
};
const formatWhatsAppDate = (isoDateString) => {
    const now = moment();
    const msgMoment = parseISODate(isoDateString);

    // Validar que la fecha es válida
    if (!msgMoment.isValid()) {
    console.warn('Fecha inválida:', isoDateString);
    return 'Fecha inválida';
    }

    // Si el mensaje es de hoy
    if (msgMoment.isSame(now, 'day')) {
    return msgMoment.format('HH:mm');
    }

    // Si el mensaje es de ayer
    if (msgMoment.isSame(now.clone().subtract(1, 'day'), 'day')) {
    return 'Ayer';
    }

    // Si el mensaje es de esta semana (últimos 7 días)
    if (msgMoment.isAfter(now.clone().subtract(7, 'days'))) {
    return msgMoment.format('dddd'); // Lunes, Martes, etc.
    }

    // Si el mensaje es de este año
    if (msgMoment.isSame(now, 'year')) {
    return msgMoment.format('DD/MM');
    }

    // Si es de otro año
    return msgMoment.format('DD/MM/YYYY');
}

export default formatWhatsAppDate