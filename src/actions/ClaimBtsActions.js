import counterpart from "counterpart";
import {key, PrivateKey} from "peerplaysjs-lib";
import ActionTypes from "../constants/ActionTypes";
import AccountRepository from "../repositories/AccountRepository";
import AccountChainRepository from "../repositories/AccountChainRepository";
import SignInService from "../services/SignInService";
import StorageService from "../services/StorageService";
import NavigateActions from "../actions/NavigateActions";
import AppActions from "../actions/AppActions";




/**
 * Private Redux Action Creator (CLAIM_BTS_SET_STATUS)
 *
 * button Status
 *
 * @param {string} status - loading|default
 * @returns {{type, payload: {status: *}}}
 */
function setStatus(status) {
    return {
        type: ActionTypes.CLAIM_BTS_SET_STATUS,
        payload: {
            status: status
        }
    }
}
/**
 * Private Redux Action Creator (CLAIM_BTS_SET_ERRORS)
 * ClaimBtsForm: common errors
 * @param {array} errors
 * @returns {{type, payload: {errors: []}}}
 */
function setErrors(errors) {
    return {
        type: ActionTypes.CLAIM_BTS_SET_ERRORS,
        payload: {
            errors: errors
        }
    }
}

class ClaimBtsActions {

    /**
     * Change button Status
     *
     * @param status
     * @returns {{type, payload: {status: *}}}
     */
    static setStatus(status) {
        return setStatus(status);
    }

    /**
     * Login bts account by private key
     *
     * @param {string} private_bts_key
     * @param {string} next
     * @returns {function(*=)}
     */
    static loginAccountFromBts(private_bts_key, next) {
        return (dispatch) => {

            let privateKey = PrivateKey.fromWif(private_bts_key),
                publicKey = privateKey.toPublicKey().toPublicKeyString();

            AccountRepository.getAccountRefsOfKey(publicKey).then((accountIds) => {

                let accountsPromises = [];
                if (accountIds && accountIds.length) {

                    accountIds.forEach((accountId) => {

                        accountsPromises.push(AccountChainRepository.getAccount(accountId));
                    });

                    return Promise.all(accountsPromises)

                } else {
                    return [];
                }

            }).then((results) => {

                let accountResult = results.find((account) => {

                    let keysNames = ['owner', 'active'];

                    let isLogin = false;

                    for (let i = 0; i < keysNames.length; i++) {

                        let userKey = keysNames[i];

                        if (account && account.getIn([userKey, 'key_auths']).size) {
                            account.getIn([userKey, 'key_auths']).forEach((keyArr) => {
                                if (keyArr.get(0) && keyArr.get(0) === publicKey) {
                                    isLogin = true;
                                }
                            });
                        }

                    }

                    return isLogin;
                });

                if (accountResult) {

                    return SignInService.systemLoginByPrivateKey(accountResult, private_bts_key, dispatch).then(({keys, wallet}) => {

                        StorageService.setEncryption(private_bts_key, wallet.encryption_key);

                        dispatch(AppActions.login(accountResult, keys, wallet));

                        if (next) {
                            dispatch(NavigateActions.navigateTo(next));
                        } else {
                            dispatch(NavigateActions.navigateToDashboard());
                        }

                        dispatch(setStatus('default'));

                    }).catch(() => {
                        dispatch(setStatus('default'));
                    });

                } else {
                    dispatch(setErrors([counterpart.translate('errors.incorrect_private_key')]));
                    dispatch(setStatus('default'));
                }


            }).catch((err) => {
                dispatch(setErrors([counterpart.translate('errors.incorrect_private_key')]));
                dispatch(setStatus('default'));
            });

        }

    }

}

export default ClaimBtsActions;