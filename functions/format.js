const FormatText = (text) => {
  const boldRegex = /(?<=\s|^)\*(.*?)\*(?=\s|$)/g;
  const italicRegex = /(?<=\s|^)_(.*?)_(?=\s|$)/g;
  const striketroughRegex = /(?<=\s|^)~(.*?)~(?=\s|$)/g;
  
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const urlRegex = /\b((https?:\/\/|www\.)\S+)\b/gi;

  // Reemplazo de URLs primero
  let formattedText = text;
  const urlMatches = formattedText.match(urlRegex);
  if (urlMatches && urlMatches.length) {
    urlMatches.forEach((item) => {
      const hrefValue = item.startsWith('www.') ? `http://${item}` : item;
      formattedText = formattedText.replace(item, `<a href="${hrefValue}" target="_blank">${item}</a>`);
    });
  }

  // Reemplazo de correos electrónicos
  const emailMatches = formattedText.match(emailRegex);
  if (emailMatches && emailMatches.length) {
    emailMatches.forEach((item) => {
      formattedText = formattedText.replace(item, `<a href="mailto:${item}">${item}</a>`);
    });
  }

  // Formateo de negrita, cursiva y tachado
  formattedText = formattedText.replace(boldRegex, "<b>$1</b>")
                               .replace(italicRegex, "<i>$1</i>")
                               .replace(striketroughRegex, "<s>$1</s>");

  return formattedText;
};

module.exports = {
  FormatText
}