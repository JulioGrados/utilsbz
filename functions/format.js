const FormatText = (text) => {
  const boldRegex = /\*(.*?)\*/g
  const italicRegex = /\_(.*?)\_/g
  const striketroughRegex = /\~(.*?)\~/g
  const matches = text.match(/\bhttps?:\/\/\S+/gi)
  
  let text2
  if (matches && matches.length) {
    matches.map((item) => {
      text2 = text.replace(item, `<a href=${item} target='_blank'>${item}</a>`)
    })
  } else {
    text2 = text
  }
  const textBold = text2.replace(boldRegex, "<b>$1</b>")
  const textItalic = textBold.replace(italicRegex, "<i>$1</i>")
  const textStriketrough = textItalic.replace(striketroughRegex, "<s>$1</s>")
  
  return textStriketrough
}

module.exports = {
  FormatText
}