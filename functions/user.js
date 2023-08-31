const payloadToData = payload => {
  return {
    ...payload,
    ref: payload._id,
    rolesName: payload.roles && payload.roles.join(', '),
    shortName: payload.firstName
      ? payload.firstName
      : payload.names && payload.names.split(' ')[0],
    password: undefined
  }
}

const dataToPayload = data => {
  return {
    username: data.username || undefined,
    names: data.names
      ? data.names
      : data.firstName + ' ' + data.lastName || undefined,
    email: data.email || undefined,
    mobile: data.mobile || undefined,
    mobileCode: data.mobileCode || undefined,
    beforeName: data.beforeName || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    firstNameCert: data.firstNameCert || undefined,
    lastNameCert: data.lastNameCert || undefined,
    dni: data.dni || undefined,
    document: data.document || undefined,
    password: data.password || undefined,
    city: data.city || undefined,
    department: data.department || undefined,
    country: data.country || undefined,
    // orden: data.orden || undefined,
    status: data.status || false,
    // position: data.position || false,
    academicLevel: data.academicLevel || [],
    photo: data.photo || undefined,
    phoneNoId: data.phoneNoId || undefined,
    description: data.description || undefined,
    address: data.address || undefined,
    roles: data.roles || undefined,
    extras: data.extras || [],
    assessor: data.assessor || undefined,
    shippings: data.shippings || undefined,
    reasign: data.reasign || undefined,
    currency: data.currency || undefined,
    moodleId: data.moodleId || undefined,
    call: {
      annexed: data.annexed || undefined,
      token: data.token || undefined
    },
    zadarma: {
      annexed: data.annexedZadarma || undefined,
      token: data.tokenZadarma || undefined
    },
    isZadarma: data.isZadarma || undefined,
    courses: data.course
      ? [data.course]
      : data.courses
      ? data.courses.map(course => ({
          ...course,
          _id: course._id || course.ref
        }))
      : [],
    sellCourses: data.sellCourses || []
  }
}

const dataToShipping = data => {
  return {
    _id: data._id || undefined,
    moodleId: data.moodleId || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    dni: data.dni || undefined,
    cellphone: data.cellphone || undefined,
    date: data.date || undefined,
    address: data.address || undefined,
    priority: data.priority || undefined,
    course: data.course
      ? {
          name: data.course.name,
          moodleId: data.course.moodleId,
          ref: data.course._id || data.course.ref || undefined
        }
      : undefined
  }
}

const createFindQuery = (user, select = '', populate = '') => {
  const { mobile, email, dni } = user
  
  const params = {
    query: {},
    select,
    populate
  }
  if (email && mobile && dni) {
    params.query = {
      $or: [{ email }, { mobile }, { dni }]
    }
  } else if (email && mobile) {
    params.query = {
      $or: [{ email }, { mobile }]
    }
  } else if (mobile) {
    params.query = {
      mobile
    }
  } else if (email) {
    params.query = {
      email
    }
  } else {
    const error = {
      status: 402,
      message: 'Faltan datos para realizar la busqueda'
    }
    throw error
  }

  return params
}

const createFindMigration = (user, select = '', populate = '') => {
  const { Celular1, Email1, DNI, Username } = user

  const params = {
    query: {},
    select,
    populate
  }
  if (Email1 && Celular1 && DNI && Username) {
    params.query = {
      $or: [{ email: Email1 }, { mobile: Celular1 }, { dni: DNI }, { username: Username }]
    }
  } else if (Email1 && Celular1 && DNI) {
    params.query = {
      $or: [{ email: Email1 }, { mobile: Celular1 }, { dni: DNI }]
    }
  } else if (Email1 && Celular1 && Username) {
    params.query = {
      $or: [{ email: Email1 }, { mobile: Celular1 }, { username: Username }]
    }
  } else if (Celular1 && DNI && Username) {
    params.query = {
      $or: [{ mobile: Celular1 }, { dni: DNI }, { username: Username }]
    }
  } else if (Email1 && Celular1) {
    params.query = {
      $or: [{ mobile: Celular1 }, { email: Email1 }]
    }
  } else if (Email1 && DNI) {
    params.query = {
      $or: [{ email: Email1 }, { dni: DNI }]
    }
  } else if (Email1 && Username) {
    params.query = {
      $or: [{ email: Email1 }, { username: Username }]
    }
  } else if (Celular1 && DNI) {
    params.query = {
      $or: [{ mobile: Celular1 }, { dni: DNI }]
    }
  } else if (Celular1 && Username) {
    params.query = {
      $or: [{ mobile: Celular1 }, { username: Username }]
    }
  } else if (DNI && Username) {
    params.query = {
      $or: [{ dni: DNI }, { username: Username }]
    }
  } else if (Celular1) {
    params.query = {
      mobile: Celular1
    }
  } else if (Email1) {
    params.query = {
      email: Email1
    }
  } else if (DNI) {
    params.query = {
      dni: DNI
    }
  } else if (username) {
    params.query = {
      username: Username
    }
  } else {
    const error = {
      status: 402,
      message: 'Faltan datos para realizar la busqueda'
    }
    throw error
  }

  return params
}

const getFullName = ({ firstName, lastName }) => {
  let fullName = ''
  if (firstName) {
    fullName += firstName
  }
  if (lastName) {
    fullName += ` ${lastName}`
  }
  return fullName
}

module.exports = {
  payloadToData,
  dataToPayload,
  getFullName,
  createFindQuery,
  createFindMigration,
  dataToShipping
}
