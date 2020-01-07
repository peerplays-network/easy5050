import ActionTypes from '../constants/ActionTypes';
// import { createModule } from 'redux-modules';
// import { Map } from 'Immutable';

/**
 * AppReducer is used to controling an application state
 *
 * Initial state
 *
 * @type {{dbIsInit: boolean, dbDataIsLoad: boolean, chainIsInit: boolean, syncIsFail: boolean, isLogin: boolean, account: null, accountId: null, currentLocation: null, status: null, showCantConnectModal: boolean}}
 */
const defaultState = {
    /**
   * iDB.init_instance() is init
   */
    dbIsInit: false,

    /**
   * ChainStore.init() Success status
   */
    chainIsInit: false,
    /**
   * ChainStore.init() failed status
   */
    syncIsFail: false,
    /**
   * Account is login
   */
    isLogin: false,
    /**
   * current account name
   */
    account: null,

    balance: 0,

    keys: {},

    wallet: null,

    showSignOutModal: false,
    /*
  * Core asset object
  */
    coreAsset: null,

    /**
   * TODO::check
   */

    /**
   * current app location(from file LocationConstants);
   */
    currentLocation: null,
    /**
   * global app status "reconnect"|null
   */
    status: null,
    /**
   * Show cant connect modal window or no
   */
    showCantConnectModal: false,

    // Select currency
    selectedCurrency: 'BTC',

    // ex rate
    exchangeRates: 1,

};

export default function (state = defaultState, action) {
    switch (action.type) {
    /**
     * iDB.init_instance() is init
     */
    case ActionTypes.APP_LOCAL_DB_IS_INIT:
        return Object.assign({}, state, {
            dbIsInit: action.dbIsInit
        });
    /**
     * ChainStore.init() Success status
     */
    case ActionTypes.APP_CHAIN_IS_INIT:
        return Object.assign({}, state, {
            chainIsInit: action.chainIsInit
        });
    /**
     * ChainStore.init() fail status
     */
    case ActionTypes.APP_SET_SYNC_FAIL:
        return Object.assign({}, state, {
            syncIsFail: action.syncIsFail
        });
    /**
     * Set CORE Asset
     */
    case ActionTypes.APP_SET_CORE_ASSET:
        return Object.assign({}, state, {
            coreAsset: action.coreAsset
        });
    /**
     * set displayed balance
     */
    case ActionTypes.APP_SET_DISPLAYED_BALANCE:
        return Object.assign({}, state, {
            balance: action.payload.balance
        });

    /**
     * login in app
     */
    case ActionTypes.APP_LOGIN:
        return Object.assign({}, state, {
            isLogin: action.payload.isLogin,
            account: action.payload.account,
            keys: action.payload.keys,
            wallet: action.payload.wallet
        });
    /**
     * logout from app
     */
    case ActionTypes.APP_LOGOUT:
        return Object.assign({}, state, {
            isLogin: false,
            account: null,
            keys: {},
            wallet: null
        });
    /**
     * logout from app
     */
    case ActionTypes.APP_TOGGLE_SIGN_OUT_MODAL:
        return Object.assign({}, state, {
            showSignOutModal: action.payload.showSignOutModal
        });

    case ActionTypes.APP_TOGGLE_PASSWORD_MODAL:
        return Object.assign({}, state, {
            showPasswordModal: action.payload.showPasswordModal
        });

    case ActionTypes.APP_SET_GLOBAL_PROPERTIES:
        return Object.assign({}, state, {
            globalProperties: action.payload.globalProperties
        });

    case ActionTypes.APP_SELECT_CURRENCY:
        return Object.assign({}, state, {
            selectedCurrency: action.payload.selectedCurrency
        });

    case ActionTypes.APP_SET_EXCHANGE_RATES:
        return Object.assign({}, state, {
            exchangeRates: action.payload.exchangeRates
        });
    default:
        /**
       * We return the previous state in the default case
       */
        return state;
    }
}
