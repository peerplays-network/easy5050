import ActionTypes from '../constants/ActionTypes'

/**
 *
 * SignUpPageReducer is used to controlling registration in an application
 *
 * Initial State
 * status - Register form: Button state
 * errors - Common validation errors
 *
 * @type {{status: string, errors: Array}}
 */
let defaultState = {
  status: 'default',
  errors: [],
}

export default function(state = defaultState, action) {
  switch (action.type) {
    /**
     * Sign Up form: Setting button state
     */
    case ActionTypes.SIGN_UP_SET_STATUS:
      return Object.assign({}, state, {
        status: action.status,
      })
    /**
     * Sign Up form: Setting Common validation errors
     */
    case ActionTypes.SIGN_UP_SET_ERRORS:
      return Object.assign({}, state, {
        errors: action.errors,
      })
    default:
      return state
  }
}
