import { Apis, ChainConfig, ChainStore } from "peerplaysjs-lib";
import CONFIG from "../configs/main";
import iDB from "../libs/idb-instance";

import ActionTypes from "../constants/ActionTypes";

import AccountChainRepository from "repositories/AccountChainRepository";
import AccountRepository from "repositories/AccountRepository";

import StorageService from "services/StorageService";
import SignInService from "services/SignInService";
import WalletService from "services/WalletService";
import CryptoService from "services/CryptoService";
import ChainService from "services/ChainService";

import NavigateActions from "actions/NavigateActions";
import ModalReducer from "reducers/ModalReducer";
import AccountHistoryReducer from "reducers/AccountHistoryReducer";
import AccountHistoryActions from "./AccountHistoryActions";

function setDisplayedBalanceAction(balance) {
  return {
    type: ActionTypes.APP_SET_DISPLAYED_BALANCE,
    payload: {
      balance: balance
    }
  };
}

/**
 *  Private Redux Action Creator (ActionTypes.APP_LOCAL_DB_IS_INIT)
 *
 * @param {boolean} dbIsInit
 * @returns {{type: (ActionTypes.APP_LOCAL_DB_IS_INIT), dbIsInit: boolean}}
 */
function setAppLocalDbInitAction(dbIsInit) {
  return {
    type: ActionTypes.APP_LOCAL_DB_IS_INIT,
    dbIsInit: dbIsInit
  };
}

/**
 * Private Redux Action Creator (ActionTypes.APP_CHAIN_IS_INIT)
 *
 * @param {boolean} chainIsInit
 * @returns {{type: (ActionTypes.APP_CHAIN_IS_INIT), chainIsInit: boolean}}
 */
function setAppChainIsInitAction(chainIsInit) {
  return {
    type: ActionTypes.APP_CHAIN_IS_INIT,
    chainIsInit: chainIsInit
  };
}

/**
 * @param {Object} Asset
 * @returns {{type: String, asset: Object}}
 */
function setAppCoreAssetAction(Asset) {
  return {
    type: ActionTypes.APP_SET_CORE_ASSET,
    coreAsset: Asset
  };
}

function setLotteryCreationFeeAction(fee) {
  return {
    type: ActionTypes.APP_SET_LOTTERY_CREATION_FEE,
    lotteryCreationFee: fee
  };
}
/**
 * Private Redux Action Creator (ActionTypes.APP_SET_SYNC_FAIL)
 *
 * @param syncIsFail
 * @returns {{type: (ActionTypes.APP_SET_SYNC_FAIL), syncIsFail: boolean}}
 */
function setAppSyncFailAction(syncIsFail) {
  return {
    type: ActionTypes.APP_SET_SYNC_FAIL,
    syncIsFail: syncIsFail
  };
}

function toggleSignOutModalAction(showSignOutModal) {
  return {
    type: ActionTypes.APP_TOGGLE_SIGN_OUT_MODAL,
    payload: {
      showSignOutModal: showSignOutModal
    }
  };
}

function togglePasswordModalAction(togglePasswordModal) {
  return {
    type: ActionTypes.APP_TOGGLE_PASSWORD_MODAL,
    payload: {
      togglePasswordModal: togglePasswordModal
    }
  };
}

function setCurrencyAction(convertTo) {
  return {
    type: ActionTypes.APP_SELECT_CURRENCY,
    payload: {
      selectedCurrency: convertTo
    }
  };
}

function setExchangeRatesAction(rates) {
  return {
    type: ActionTypes.APP_SET_EXCHANGE_RATES,
    payload: {
      exchangeRates: rates
    }
  };
}


function setGlobalPropertiesAction(globalProperties) {
  return {
    type: ActionTypes.APP_SET_GLOBAL_PROPERTIES,
    payload: { globalProperties }
  };
}

/**
 * Private Redux Action Creator (APP_LOGIN)
 * Account Login in app
 *
 * @param {Object} account
 * @param {Object} keys
 * @param {Object} wallet
 * @returns {{type, payload: {isLogin: boolean, account: String, accountId: String}}}
 */
function loginAction(account, keys, wallet) {
  return {
    type: ActionTypes.APP_LOGIN,
    payload: {
      account,
      keys,
      wallet,
      isLogin: true
    }
  };
}

/**
 *  Private Redux Action Creator (ActionTypes.APP_LOGOUT)
 *  User Logout
 *
 * @returns {{type, payload: {}}}
 */
function logoutAction() {
  return {
    type: ActionTypes.APP_LOGOUT,
    payload: {}
  };
}

class AppActions {
  static init() {
    return (dispatch, getState) => {
      ChainConfig.setPrefix(CONFIG.CORE_ASSET);
      ChainStore.getObject(CONFIG.CORE_ASSET_ID);
      ChainStore.setDispatchFrequency(0);
      Apis.instance(CONFIG.BLOCKCHAIN_URL, true).init_promise.then(res => {
        try {
          const db = iDB.init_instance(
            window.indexedDB ||
              window.mozIndexedDB ||
              window.webkitIndexedDB ||
              window.msIndexedDB ||
              window.shimIndexedDB
          ).init_promise;

          return db
            .then(() => {
              dispatch(AppActions.setAppLocalDbInit(true));

              ChainStore.init()
                .then(
                  () =>
                    new Promise((success, fail) => {
                      ChainStore.FetchChain(
                        "getAsset",
                        ChainConfig.address_prefix
                      )
                        .then(asset => {
                          dispatch(AppActions.setAppCoreAsset(asset));
                          return AccountChainRepository.getObject('2.0.0');
                        }).then((fees) => {
                          const fee = fees.toJS().parameters.current_fees.parameters[77][1].lottery_asset
                          dispatch(AppActions.setLotteryCreationFee(fee));
                          success();
                        })
                        .catch(fail);
                    })
                )
                .then(() => {
                  SignInService.checkLoginAccount().then(account => {
                    // console.log('account', account.toJS());
                    if (account) {
                      WalletService.checkEnableWallet()
                        .then(isEnable => {
                          if (isEnable) {
                            Promise.all([
                              WalletService.getDBKeys(),
                              WalletService.getDBWallet()
                            ]).then(([keys, wallet]) => {
                              //console.log("wallet && keys", wallet && keys);
                              if (wallet && keys) {
                                // account = account.set('encryption', CryptoService.formEncryption(password, wallet.encryption_key));

                                dispatch(
                                  AppActions.login(account, keys, wallet)
                                );
                                if (
                                  /\/$/.test(window.location.pathname) ||
                                  /\/sign-in/.test(window.location.pathname) ||
                                  /\/sign-up/.test(window.location.pathname) ||
                                  /\/claims/.test(window.location.pathname)
                                ) {
                                  dispatch(
                                    NavigateActions.navigateToDashboard()
                                  );
                                }
                              } else {
                                dispatch(AppActions.logout());
                              }

                              dispatch(AppActions.setAppChainIsInit(true));
                            });
                          } else {
                            dispatch(AppActions.logout());
                            dispatch(AppActions.setAppChainIsInit(true));
                          }
                        })
                        .catch(() =>
                          dispatch(
                            ModalReducer.actions.showModal("browserSupport")
                          )
                        );
                    } else {
                      console.warn("[APP] ACCOUNT NOT LOGIN", account);

                      if (
                        !/\/sign-in/.test(window.location.pathname) &&
                        !/\/claims/.test(window.location.pathname) &&
                        !/\/sign-up/.test(window.location.pathname)
                      ) {
                        dispatch(AppActions.logout());
                      }

                      dispatch(AppActions.setAppChainIsInit(true));
                    }
                  });
                });
            })
            .catch(() =>
              dispatch(ModalReducer.actions.showModal("browserSupport"))
            );
        } catch (err) {
          console.error("DB init error:", err);
          dispatch(AppActions.setAppSyncFail(true));
          dispatch(ModalReducer.actions.showModal("browserSupport"));
          // dispatch(AppActions.setShowCantConnectStatus(true));
        }
      });
    };
  }

  /**
   *  login in app-Reducer
   *
   * @param {Object} account
   * @param {Object} keys
   * @param {Object} wallet
   * @returns {function(*)}
   */
  static login(account, keys, wallet) {
    return (dispatch, getState) => {
      let history = account.get("history");
      account = account.remove("history");
      let balance = AccountChainRepository.getAccountBalance(account);
      dispatch(AppActions.setDisplayedBalance(balance))
      console.warn("getting balance . . .: " + balance);

      dispatch(loginAction(account, keys, wallet));

      AccountHistoryActions.setAccountHistory(dispatch, getState);
    };
  }

  /**
   *  Reducer: APP Logout action
   *
   * @returns {Function}
   */
  static logout() {
    return dispatch => {
      StorageService.remove("currentAccount");
      StorageService.remove("displayedBalance");

      AccountChainRepository.resetCache();

      return WalletService.resetDBTables().then(() => {
        dispatch(logoutAction());
        StorageService.resetEncryption();
        dispatch(NavigateActions.navigateToLanding());
        dispatch(ModalReducer.actions.hideModal("signOut"));
        // window.location.pathname = '/home';

      });
    };
  }



  static logoutAndReload() {
    return dispatch => {
      StorageService.remove("currentAccount");
      StorageService.remove("displayedBalance");

      AccountChainRepository.resetCache();

      return WalletService.resetDBTables().then(() => {
        dispatch(logoutAction());
        StorageService.resetEncryption();
        dispatch(NavigateActions.navigateToLanding());
        dispatch(ModalReducer.actions.hideModal("signOut"));
        window.location.pathname = '/home';

      });
    };
  }

  /**
   *
   * @param status boolean
   * @returns {Function}
   */
  static setAppLocalDbInit(status) {
    return dispatch => {
      dispatch(setAppLocalDbInitAction(status));
    };
  }

  /**
   * ChainStore.init() Success status
   *
   * @param status boolean
   * @returns {Function}
   */
  static setAppChainIsInit(status) {
    return dispatch => {
      dispatch(setAppChainIsInitAction(status));
    };
  }

  /**
   * @param asset
   * @returns {Function}
   */
  static setAppCoreAsset(asset) {
    return dispatch => {
      dispatch(setAppCoreAssetAction(asset));
    };
  }

  /**
   * @param fee string
   * @returns {Function}
   */
  static setLotteryCreationFee(fee) {
    return dispatch => { 
      dispatch(setLotteryCreationFeeAction(fee));
    }
  }

  /**
   * ChainStore.init() failed status
   *
   * @param status boolean
   * @returns {Function}
   */
  static setAppSyncFail(status) {
    return dispatch => {
      dispatch(setAppSyncFailAction(status));
    };
  }

  static toggleSignOutModal(showSignOutModal) {
    return dispatch => {
      dispatch(toggleSignOutModalAction(showSignOutModal));
    };
  }

  static togglePasswordModal(isShowed) {
    return dispatch => {
      dispatch(togglePasswordModalAction(isShowed));
    };
  }

  static getAllAccounts(searchedString) {
    return dispatch => {
      return new Promise((resolve, reject) => {
        AccountRepository.lookupAccounts(searchedString, 50)
          .then(accountList => {
            accountList.pop();
            resolve(accountList);
          })
          .catch(err => reject(err));
      });
    };
  }

  static setGlobalProperties() {
    return dispatch => {
      AccountRepository.getGlobalProperties()
        .then(globalProperties =>
          dispatch(setGlobalPropertiesAction(globalProperties))
        )
        .catch(err => console.error(err));
    };
  }

  static setDisplayedBalance(bal) {
    console.log('%c BALANCE UPDATE', 'background: #222; color: #F3A719');
    if (bal) {
      StorageService.set("displayedBalance", bal);
    }

    return dispatch => {
      dispatch(setDisplayedBalanceAction(bal));
    };
  }

  static selectCurrency(convertTo) {
    return dispatch => {
      dispatch(setCurrencyAction(convertTo));
    };
  }

  static setExchangeRates(exchangeRates) {
    return dispatch => {
      dispatch(setExchangeRatesAction(exchangeRates));
    };
  }


}

export default AppActions;
