import LS from '../libs/localStorage';

import CryptoService from 'services/CryptoService';

let accountStorage = LS('__sweeps__');

/**
 * Base Storage service
 *
 * Here we work with Local Storage
 */
class StorageService {
  static get() {
    return accountStorage.get.apply(accountStorage, arguments)
  }

  static set() {
    return accountStorage.set.apply(accountStorage, arguments)
  }

  static remove() {
    return accountStorage.remove.apply(accountStorage, arguments)
  }

  static getEncryption() {

    const encryptionHex = accountStorage.get('encryption');

    return new Buffer(encryptionHex, 'hex')
  }

  static setEncryption(password, encryption_key) {
    accountStorage.set('encryption', CryptoService.formEncryption(password, encryption_key));
  }

  static resetEncryption() {
    accountStorage.remove('encryption');
  }
}

export default StorageService
