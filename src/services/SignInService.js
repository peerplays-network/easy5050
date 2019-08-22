import StorageService from '../services/StorageService'
import WalletService from '../services/WalletService'
import AccountChainRepository from '../repositories/AccountChainRepository'

class SignInService {
  /**
   * check at the start of the application if the user is logged in
   *
   * @param {Object} account
   * @returns {Promise}
   */
  static checkLoginAccount(
    account = StorageService.get('currentAccount', null),
  ) {
    return new Promise(resolve => {
      if (account) {
        AccountChainRepository.getAccount(account.id) //account.id
          .then(account => {
            if (account) {
              return resolve(account)
            } else {
              return resolve(null)
            }
          })
          .catch(() => {
            return resolve(null)
          })
      } else {
        return resolve(null)
      }
    })
  }

  /**
   * Login user in system(create wallet by account, set iDB keys)
   * @param {Object} account
   * @param {string} password
   * @param dispatch
   */
  static systemLogin(account, password, dispatch) {
    return WalletService.createWalletByAccount(
      account.get('name'),
      password
    ).then(wallet => {
      return WalletService.getDBKeys().then(keys => {

        StorageService.set('currentAccount', {
          id: account.get('id'),
          name: account.get('name'),
        });

        return { wallet, keys }
      })
    })
  }

  static systemLoginByPrivateKey(account, privateKeyWif, dispatch) {

      return WalletService.createWalletByPrivateKey(account, privateKeyWif).then((wallet) => {
          return WalletService.getDBKeys().then(keys => {

              StorageService.set('currentAccount', {
                  id: account.get('id'),
                  name: account.get('name'),
              });

              return { wallet, keys }
          })
      });

  }

}

export default SignInService
