import ActionTypes from '../constants/ActionTypes';
/**
 * Login Page Reducer is used to controlling login in an application
 * Initial State
 * status - Login form: Button state
 * errors - Login form: Common validation errors
 * accountForLogin - Login form: If the account exists and it's valid, then we work with it
 * @type {{status: string, errors: Array, accountForLogin: null}}
 */
let defaultState = {
  status: 'default',
  errors: [],
  accountForLogin: null,
}

export default function(state = defaultState, action) {
  switch (action.type) {
    /**
     * SignIn form: Setting button state
     */
    case ActionTypes.SIGN_IN_SET_STATUS:
      return Object.assign({}, state, {
        status: action.status,
      })
    /**
     * SignIn form: Set up a login account
     */
    case ActionTypes.SIGN_IN_SET_ACCOUNT_FOR_LOGIN:
      return Object.assign({}, state, {
        accountForLogin: action.accountForLogin,
      })
    /**
     * SignIn form: Setting Common validation errors
     */
    case ActionTypes.SIGN_IN_SET_LOGIN_ERRORS:
      return Object.assign({}, state, {
        errors: action.errors,
      })
    default:
      /**
       * We return the previous state in the default case
       */
      return state
  }
}
