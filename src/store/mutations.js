import types from './mutation-types'
export default {
  [types.SET_DIALOG] (state, data) {
    state.showDialogMsg = data
  }
}
