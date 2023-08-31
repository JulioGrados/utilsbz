'use strict'
const moment = require('moment')
// transform params to queries
const transformParams = params => {
  const query = transformQuery(params.query)
  const aggregate = transformAggregate(params.aggregate)
  const select = transformSelect(params.select)
  const populate = transformPopulate(params.populate)
  const limit = transformLimit(params.limit)
  const sort = transformSort(params.sort)
  const skip = transformSkip(params.skip)

  return {
    query,
    aggregate,
    select,
    populate,
    limit,
    sort,
    skip
  }
}

const transformQuery = query => {
  let newQuery = {}
  if (query) {
    if (typeof query === 'string') {
      newQuery = JSON.parse(query)
    } else if (typeof query === 'object') {
      newQuery = query
    }
  }

  return newQuery
}

const transformAggregate = aggregate => {
  let newAggregate = {}
  if (aggregate) {
    if (typeof aggregate === 'string') {
      newAggregate = JSON.parse(aggregate).aggregate
    } else if (typeof aggregate === 'object') {
      newAggregate = aggregate.aggregate
    }
  }
  return newAggregate
}

const transformSelect = select => {
  let newSelect = ''
  if (select) {
    if (typeof select === 'string') {
      newSelect = select
    } else if (Array.isArray(select)) {
      newSelect = select.join(' ')
    }
  }

  return newSelect
}

const transformPopulate = populate => {
  let newPopulate = ''
  if (populate) {
    if (typeof populate === 'string') {
      newPopulate = JSON.parse(populate)
    } else {
      newPopulate = populate
    }
  }

  return newPopulate
}

const transformLimit = limit => {
  let newLimit = 0
  if (limit) {
    if (typeof limit === 'string') {
      newLimit = parseInt(limit)
    } else {
      newLimit = limit
    }
  }

  return newLimit
}

const transformSkip = skip => {
  let newSkip = 0
  if (skip) {
    if (typeof skip === 'string') {
      newSkip = parseInt(skip)
    } else {
      newSkip = skip
    }
  }

  return newSkip
}

const transformSort = sort => {
  let newSort = '-createdAt'
  if (sort) {
    newSort = sort
  }

  return newSort
}

const getFullName = user => {
  let fullname = ''
  if (user.firstName) {
    fullname = user.firstName
  }
  if (user.lastName) {
    fullname += ' ' + user.lastName
  }
  return fullname
}

const replaceContent = ({
  text = '',
  template,
  course,
  user,
  sale,
  linked,
  assigned
}) => {

  const getStart = (start = new Date()) => {
    let inicio
    if ( start && moment(new Date(moment(start).format('YYYY-MM-DD'))).isAfter(new Date()) ) {
      inicio = start
    } else {
      inicio = new Date()
    }
    const day = new Date(inicio).getDay()
    let sum1 = 0; let sum2 = 0; let sum3 = 0
    if (day >= 0 && day < 4) {
      sum1 = 1
      sum2 = 2
      sum3 = 3
    } else if (day === 4) {
      sum1 = 1
      sum2 = 2
      sum3 = 4
    } else if (day === 5) {
      sum1 = 1
      sum2 = 3
      sum3 = 4
    } else if (day === 6) {
      sum1 = 2
      sum2 = 3
      sum3 = 4
    }
    const day1 = moment(start).add(sum1, 'days').format('D') + ' de ' + moment(start).add(sum1, 'days').format('MMMM')
    const day2 = moment(start).add(sum2, 'days').format('D') + ' de ' + moment(start).add(sum2, 'days').format('MMMM')
    const day3 = moment(start).add(sum3, 'days').format('D') + ' de ' + moment(start).add(sum3, 'days').format('MMMM')
    return day1 + ', ' + day2 + ' y ' + day3
  }
  linked.names = linked.firstName + ' ' + linked.lastName
  template.variables.map(variable => {
    if (variable && variable.field) {
      const value = variable.field.split('.')
      const model = value[0]
      const nameField = value[1]
      const regex = new RegExp(`{{${variable.name}}}`, 'gi')
      if (model === 'course' && course) {
        
        if (nameField === 'published') {
          text = text.replace(regex, getStart(course[nameField]))
        } else {
          text = text.replace(regex, course[nameField])
        }
      }
      if (model === 'user' && user) {
        text = text.replace(regex, user[nameField])
      }
      if (model === 'linked' && linked) {
        text = text.replace(regex, linked[nameField])
      }
      if (model === 'assigned' && assigned) {
        text = text.replace(regex, assigned[nameField])
      }
      if (model === 'sale' && sale) {
        text = text.replace(regex, sale[nameField])
      }
    }
  })

  return text
}

const replaceVariables = (text = '', model) => {
  if (!model) {
    return text
  }
  for (let label in model) {
    const regex = new RegExp(`{{${label}}}`, 'gi')
    text = text.replace(regex, model[label])
  }
  return text
}

function stripHtmlTags (html) {
  var tag = document.createElement('div')
  tag.innerHTML = html

  return tag.innerText
}

module.exports = {
  transformParams,
  getFullName,
  replaceContent,
  stripHtmlTags,
  replaceVariables
}
