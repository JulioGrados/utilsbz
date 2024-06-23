const templateSelectTeam = async (greeting, teams) => {
    let options = ''
    teams.forEach((element, index) => {
        options = options + `${(index + 1)}.- ${element.name}` + '\n'
    })
    return (greeting + '\n' + options)
}

module.exports = {
    templateSelectTeam
}