import counterpart from "counterpart";
import ActionTypes from "../constants/ActionTypes";
import KeyGeneratorService from "../services/KeyGeneratorService";
import AccountChainRepository from "../repositories/AccountChainRepository";
import SignInService from "../services/SignInService";
import NavigateActions from "../actions/NavigateActions";
import AppActions from "../actions/AppActions";

import StorageService from 'services/StorageService';

/**
 * Private Action Creator (SIGN_IN_SET_STATUS)
 * @param status
 * @returns {{type: ActionTypes.SIGN_IN_SET_STATUS, status: *}}
 */
function setLoginStatusAction(status) {
    return {
        type: ActionTypes.SIGN_IN_SET_STATUS,
        status: status
    }
}
/**
 * Private Action Creator (SIGN_IN_SET_ACCOUNT_FOR_LOGIN)
 * @param {String} account
 * @returns {{type: (ActionTypes.SIGN_IN_SET_ACCOUNT_FOR_LOGIN), accountForLogin: *}}
 */
function setLoginAccountAction(account) {
    return {
        type: ActionTypes.SIGN_IN_SET_ACCOUNT_FOR_LOGIN,
        accountForLogin: account
    }
}
/**
 * Private Action Creator (SIGN_IN_SET_LOGIN_ERRORS)
 * @param {Array} errors
 * @returns {{type: (ActionTypes.SIGN_IN_SET_LOGIN_ERRORS), errors: *}}
 */
function setLoginErrorsAccountAction(errors) {
    return {
        type: ActionTypes.SIGN_IN_SET_LOGIN_ERRORS,
        errors: errors
    }
}

class SignInActions {

    /**
     *
     * @param {String} accountName
     * @param {String} password
     * @param {String} next
     * @return {function(*=, *)}
     */
    static signIn(accountName, password, next) {

        return (dispatch, getState) => {

            let state = getState(),
                keys = KeyGeneratorService.generateKeys(accountName, password),
                publicKey = keys.active.toPublicKey().toPublicKeyString(),
                isLogin = false;

            AccountChainRepository.getAccount(state.signInPage.accountForLogin[1]).then(function (account) {

                if (account && account.getIn(['active', 'key_auths']).size) {
                    account.getIn(['active', 'key_auths']).forEach(function (keyArr) {
                        if (keyArr.get(0) && keyArr.get(0) === publicKey) {
                            isLogin = true;
                        }
                    });
                }

                if (isLogin) {

                    return SignInService.systemLogin(account, password, dispatch).then(({keys, wallet}) => {

                        StorageService.setEncryption(password, wallet.encryption_key);

                        dispatch(AppActions.login(account, keys, wallet));

                        if (next) {
                            dispatch(NavigateActions.navigateTo(next));
                        } else {
                            dispatch(NavigateActions.navigateToDashboard());
                        }

                        dispatch(SignInActions.setLoginStatus('default'));

                    });

                } else {

                    dispatch(SignInActions.setLoginStatus('default'));

                    dispatch(SignInActions.setLoginErrorsAccount([
                        counterpart.translate("errors.incorrect_username_or_password")
                    ]));

                }

            });

        }

    }

    /**
     * Login form: Button state
     *
     * @param {String} status
     * @returns {Function}
     */
    static setLoginStatus(status) {
        return (dispatch) => {
            dispatch(setLoginStatusAction(status));
        };
    }

    /**
     * Login form: Set up a login account
     *
     * @param account
     * @returns {Function}
     */
    static setLoginAccount(account) {
        return (dispatch) => {
            dispatch(setLoginErrorsAccountAction([]));
            dispatch(setLoginAccountAction(account));
        };
    }

    /**
     * Login form: Setting Common validation errors
     *
     * @param errors Array
     * @returns {Function}
     */
    static setLoginErrorsAccount(errors) {
        return (dispatch) => {
            dispatch(setLoginErrorsAccountAction(errors));
        };
    }

}

export default SignInActions;