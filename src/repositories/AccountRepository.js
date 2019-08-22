import { Apis } from 'peerplaysjs-lib';
import CONFIG from '../configs/main';

const MAX_RECURSION_ATTEMPTS = 20

class AccountRepository {
  /**
   *
   * @param {String} startChar
   * @param {Number} limit
   * @return {Promise}
   */
  static lookupAccounts(startChar, limit) {
    return Apis.instance()
    .db_api()
    .exec('lookup_accounts', [startChar, limit]);
  }

  static getAccount(accountIdOrName, numRecursion = 0) {
        return new Promise((resolve, reject) => {
        let fullAccount = ChainStore.getAccount(accountIdOrName)

        if (numRecursion > MAX_RECURSION_ATTEMPTS) {
            console.warn('[APP] MAX_RECURSION_ATTEMPTS Repository.getAccount()')
            return reject()
        }

        if (fullAccount === null) return reject()

        if (fullAccount) return resolve(fullAccount)

        setTimeout(() => {
            this.getAccount(accountIdOrName, ++numRecursion)
            .then(res => resolve(res))
            .catch(err => reject(err))
        }, 100)
        })
  }

  /**
   *
   * @param {String} accountIdOrName
   * @return {Promise}
   */
  static fetchFullAccount(accountIdOrName) {
    return Apis.instance()
        .db_api()
        .exec('get_full_accounts', [[accountIdOrName], true])
        .then(results => {
            if (results.length === 0 && !results[0]) {
            return null
            }

            return results[0]
        })
  }

  /**
   *
   * @param attempt
   * @param accountName
   * @param ownerPrivate
   * @param activePrivate
   * @param memoPrivate
   * @param referral
   * @return {Promise}
   */
  static fetchFaucetAddress(
    attempt,
    accountName,
    ownerPrivate,
    activePrivate,
    memoPrivate,
    referral,
  ) {
        return new Promise((resolve, reject) => {
        let faucets = CONFIG['FAUCET_URLS'],
            index = Math.floor(Math.random() * Object.keys(faucets).length),
            faucetAddress = faucets[index]

        // if (window && window.location && window.location.protocol === 'https:') {
        //     faucetAddress = faucetAddress.replace(/http:\/\//, 'https://')
        // }

        return fetch(faucetAddress, {
            method: 'post',
            mode: 'cors',
            headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            },
            body: JSON.stringify({
            account: {
                name: accountName,
                owner_key: ownerPrivate.toPublicKey().toPublicKeyString(),
                active_key: activePrivate.toPublicKey().toPublicKeyString(),
                memo_key: memoPrivate.toPublicKey().toPublicKeyString(),
                refcode: referral,
                referrer: window && window.BTSW ? BTSW.referrer : '',
            },
            }),
        })
            .then(response => {
            let res = response.json()

            return resolve(res)
            })
            .catch(err => {
            if (attempt > 2) {
                reject(err)
            } else {
                attempt++

                return AccountRepository.fetchFaucetAddress(
                attempt,
                accountName,
                ownerPrivate,
                activePrivate,
                referral,
                )
                .then(res => resolve(res))
                .catch(err => reject(err))
            }
            })
        })
  }

    static getAccountRefsOfKey(key) {
        return Apis.instance().db_api().exec("get_key_references", [[key]]).then((vec_account_id) => {

            if (vec_account_id[0] && vec_account_id[0].length) {
                return vec_account_id[0];
            }

            return null;
        });
    }

    static getGlobalProperties() {
        return Apis.instance().db_api().exec('get_global_properties', []);
    }
}

export default AccountRepository;

