
const state = {
  submitForm: null
}

const mutations = {
  SET_SUBMIT_FORM: (state, data) => {
    console.log('order.js mutations', data)
    state.submitForm = data
  }
}

const actions = {
  // remove token
  setSubmitForm({ commit }, data) {
    console.log('order.js actions', data)
    return new Promise(resolve => {
      commit('SET_SUBMIT_FORM', data)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
