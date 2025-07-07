const boundaryAfter  = '(?=\\s|$|[.,;:!?])';
const boundaryBefore = '(?<=\\s|^|[.,;:!?])';

const boldRegex   = new RegExp(`${boundaryBefore}\\*(.*?)\\*${boundaryAfter}`, 'g');
const italicRegex = new RegExp(`${boundaryBefore}_(.*?)_${boundaryAfter}`, 'g');
const strikeRegex = new RegExp(`${boundaryBefore}~(.*?)~${boundaryAfter}`, 'g');

const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const urlRegex   = /\b((https?:\/\/|www\.)\S+)\b/gi;

function FormatText(text = '') {
  let formattedText = text;

  formattedText = formattedText
    .replace(boldRegex, '<b>$1</b>')
    .replace(italicRegex, '<i>$1</i>')
    .replace(strikeRegex, '<s>$1</s>');

  // 1. URLs
  formattedText = formattedText.replace(urlRegex, (m) => {
    const href = m.startsWith('www.') ? `http://${m}` : m;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${m}</a>`;
  });

  // 2. Correos
  formattedText = formattedText.replace(emailRegex, (m) => {
    return `<a href="mailto:${m}">${m}</a>`;
  });

  // 3. Saltos de línea → <br>  (opcional)
  formattedText = formattedText.replace(/\n/g, '<br>');

  return formattedText;
}


module.exports = {
  FormatText
};
