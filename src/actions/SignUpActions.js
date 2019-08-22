import ActionTypes from "../constants/ActionTypes";
import SignInService from "../services/SignInService";
import KeyGeneratorService from "../services/KeyGeneratorService";
import AccountChainRepository from "../repositories/AccountChainRepository";
import AccountRepository from "../repositories/AccountRepository";
import NavigateActions from "../actions/NavigateActions";
import AppActions from "../actions/AppActions";

import StorageService from 'services/StorageService';
/**
 * Private Redux Action Creator (ActionTypes.SIGN_UP_SET_STATUS)
 *
 * @param {String} status
 * @returns {{type, status: *}}
 */
function setRegisterStatusAction(status) {
    return {
        type: ActionTypes.SIGN_UP_SET_STATUS,
        status: status
    }
}

/**
 * Private Redux Action Creator (ActionTypes.SIGN_UP_SET_ERRORS)
 *
 * @param {Array} errors
 * @returns {{type, errors: []}}
 */
function setCommonErrorsAction(errors) {
    return {
        type: ActionTypes.SIGN_UP_SET_ERRORS,
        errors: errors
    }
}

class SignUpActions {
    /**
     *  Sign Up form: Setting "Create account" button state
     *
     * @param {String} status
     * @returns {function(*)}
     */
    static setRegisterStatus(status) {
        return (dispatch) => {
            dispatch(setRegisterStatusAction(status));
        };
    }

    /**
     * Sign Up account in app
     *
     * @param {String} accountName
     * @param {String} password
     * @param {String} registrarAccount
     * @param {String|null} referral
     * @returns {function(*=)}
     */
    static signUp(accountName, password, registrarAccount = null, referral = null) {

        return (dispatch, getState) => {

            const state = getState();
            let keys = KeyGeneratorService.generateKeys(accountName, password);

            dispatch(setCommonErrorsAction([]));

            if (registrarAccount) {

            } else {
                return AccountRepository.fetchFaucetAddress(1, accountName, keys.owner, keys.active, keys.memo, referral)
                    .then(result => {
                        if(result.error) {
                            console.warn("CREATE ACCOUNT RESPONSE", result);
                            console.warn("CREATE ACCOUNT ERROR", result.error);
                            throw result.error;
                        }
                        console.log('fetchFaucetAddress RESULT', result);
                        return result;
                    }).then(() => {

                        return AccountChainRepository.getAccount(accountName).then((account) => {
                            return SignInService.systemLogin(account, password, dispatch).then(({keys, wallet}) => {

                                StorageService.setEncryption(password, wallet.encryption_key);

                                dispatch(AppActions.login(account, keys, wallet));
                                dispatch(NavigateActions.navigateToDashboard());
                                dispatch(SignUpActions.setRegisterStatus('default'));
                            });

                        });

                    }).catch(error => {

                        dispatch(SignUpActions.setRegisterStatus('default'));

                        let errorKeys = Object.keys(error),
                            errors = [];

                        errorKeys.forEach((errorKey) => {
                            errors.push(error[errorKey]);
                        });

                        if (errors.length) {
                            return dispatch(setCommonErrorsAction(errors));
                        }

                        return dispatch(setCommonErrorsAction(['Faucet registration failed']));

                    });

            }

        }

    }

}

export default SignUpActions;