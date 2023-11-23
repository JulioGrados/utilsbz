const FormatText = (text) => {
  const boldRegex = /\*(.*?)\*/g
  const italicRegex = /\_(.*?)\_/g
  const striketroughRegex = /\~(.*?)\~/g

  const textBold = text.replace(boldRegex, "<b>$1</b>")
  const textItalic = textBold.replace(italicRegex, "<i>$1</i>")
  const textStriketrough = textItalic.replace(striketroughRegex, "<s>$1</s>")
  
  return textStriketrough
}

module.exports = {
  FormatText
}