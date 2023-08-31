const loadingReducer = state => {
  return {
    ...state,
    loading: true,
    error: ''
  }
}

const errorReducer = (state, message) => {
  return {
    ...state,
    loading: false,
    error: message
  }
}

const successReducer = (state, data) => {
  return {
    ...state,
    ...data,
    loading: false,
    error: ''
  }
}

const cleanReducer = state => {
  return {
    ...state,
    loading: false,
    error: ''
  }
}

const updateItem = (list, payload) => {
  const listSlice = list.slice()
  const index = listSlice.findIndex(item => item._id === payload._id)

  if (index !== -1) {
    listSlice[index] = payload
  }

  return listSlice
}

const removeItem = (list, payload) => {
  const listSlice = list.slice()
  const index = listSlice.findIndex(item => item._id === payload._id)

  if (index !== -1) {
    listSlice.splice(index, 1)
  }

  return listSlice
}

module.exports = {
  loadingReducer,
  successReducer,
  errorReducer,
  cleanReducer,
  updateItem,
  removeItem
}
