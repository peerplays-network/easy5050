export default {
    /**
     * SignIn form: Button state
     */
    SIGN_IN_SET_STATUS: 'SIGN_IN_SET_STATUS',
    /**
     * SignIn form: Set up a login account
     */
    SIGN_IN_SET_ACCOUNT_FOR_LOGIN: 'SIGN_IN_SET_ACCOUNT_FOR_LOGIN',
    /**
     * SignIn form: Setting Common validation errors
     */
    SIGN_IN_SET_LOGIN_ERRORS: 'SIGN_IN_SET_LOGIN_ERRORS',

    /**
     * Register form: Button state
     */
    SIGN_UP_SET_STATUS: 'SIGN_UP_SET_STATUS',
    /**
     * Register form: Setting Common validation errors
     */
    SIGN_UP_SET_ERRORS: 'REGISTER_SET_ERRORS',

    /**
     * App Reducer
     *
     * APP_LOCAL_DB_IS_INIT - iDB.init_instance() is init
     * APP_CHAIN_IS_INIT - ChainStore.init() Success status
     * const APP_SET_SYNC_FAIL - ChainStore.init() fail status
     *
     * const APP_SET_STATUS - global app status "reconnect"|null//TODO::check
     * const APP_SET_SHOW_CANT_CONNECT_MODAL - Show cant connect modal window or no//TODO::check
     */
    APP_LOCAL_DB_IS_INIT: 'APP_LOCAL_DB_IS_INIT',
    APP_CHAIN_IS_INIT: 'APP_CHAIN_IS_INIT',
    APP_SET_CORE_ASSET: 'APP_SET_CORE_ASSET',
    APP_SET_SYNC_FAIL: 'APP_SET_SYNC_FAIL',
    APP_SET_DISPLAYED_BALANCE: 'APP_SET_DISPLAYED_BALANCE',
    APP_LOGIN: 'APP_LOGIN',
    APP_LOGOUT: 'APP_LOGOUT',
    APP_TOGGLE_SIGN_OUT_MODAL: 'APP_TOGGLE_SIGN_OUT_MODAL',
    APP_TOGGLE_PASSWORD_MODAL: 'APP_TOGGLE_PASSWORD_MODAL',
    APP_GET_ALL_ACCOUNTS: 'APP_GET_ALL_ACCOUNTS',
    APP_SELECT_CURRENCY: 'APP_SELECT_CURRENCY',
    APP_SET_EXCHANGE_RATES: 'APP_SET_EXCHANGE_RATES',

    APP_SET_GLOBAL_PROPERTIES: 'APP_SET_GLOBAL_PROPERTIES',

    CLAIM_BTS_SET_STATUS: 'CLAIM_BTS_SET_STATUS',
    CLAIM_BTS_SET_ERRORS: 'CLAIM_BTS_SET_ERRORS',
};
