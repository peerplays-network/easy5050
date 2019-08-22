import KeyGeneratorService from './KeyGeneratorService'
import { Apis, ChainConfig, PrivateKey, key, Aes, hash } from 'peerplaysjs-lib'
import iDB from '../libs/idb-instance'
import idb_helper from '../libs/idb-helper'

class WalletService {
  /**
   *
   * @param {String} accountName
   * @param {String} password
   * @return {Promise}
   */
  static createWalletByAccount(accountName, password) {
    if (typeof password !== 'string') {
      throw new Error('password string is required')
    }

    if (typeof accountName !== 'string') {
      throw new Error('accountName must be a string')
    }

    if (accountName.trim() === '') {
      throw new Error('accountName can not be an empty string')
    }

    let passwordAes = Aes.fromSeed(password),
      encryptionBuffer = key.get_random_key().toBuffer(),
      encryptionKey = passwordAes.encryptToHex(encryptionBuffer),
      privateAesLocal = Aes.fromSeed(encryptionBuffer)

    let walletName = iDB.getCurrentWalletName(),
      keys = KeyGeneratorService.generateKeys(accountName, password),
      brainKeyPrivate = keys.active,
      brainKeyPublic = brainKeyPrivate.toPublicKey().toPublicKeyString(),
      brainKeyEncrypted = privateAesLocal.encryptToHex(
        brainKeyPrivate.toBuffer(),
      ),
      passwordPrivate = PrivateKey.fromSeed(password),
      passwordPublic = passwordPrivate.toPublicKey().toPublicKeyString(),
      date = new Date(),
      wallet = {
        public_name: walletName,
        password_pubkey: passwordPublic,
        encryption_key: encryptionKey,
        encrypted_brainkey: brainKeyEncrypted,
        brainkey_pubkey: brainKeyPublic,
        brainkey_sequence: 0,
        brainkey_backup_date: date,
        created: date,
        last_modified: date,
        chain_id: Apis.instance().chain_id,
      }

    return WalletService.resetDBTables()
      .then(WalletService.saveKeysToDB(keys, privateAesLocal))
      .then(WalletService.saveWalletToDB(wallet))
      .then(WalletService.setCurrentWalletNameToDB(walletName))
      .then(() => {
        return wallet
      })
  }

  /**
   * Create Wallet by Wif private key
   * @param account
   * @param privateKeyWif
   * @returns {Promise}
   */
  static createWalletByPrivateKey(account, privateKeyWif) {

    if(!account) {
        throw new Error("account is required");
    }

    if(typeof privateKeyWif !== 'string') {
        throw new Error("password string is required");
    }

    if(privateKeyWif.trim() === "") {
        throw new Error("accountName can not be an empty string");
    }

    let passwordAes = Aes.fromSeed(privateKeyWif),
        encryptionBuffer = key.get_random_key().toBuffer(),
        encryptionKey = passwordAes.encryptToHex(encryptionBuffer),
        privateAesLocal = Aes.fromSeed(encryptionBuffer);

    let privateKeyObject = PrivateKey.fromWif(privateKeyWif),
        publicKey = privateKeyObject.toPublicKey().toPublicKeyString();

    let keysNames = ['owner', 'active'],
        keys = {};

    for (let i = 0; i < keysNames.length; i++) {

        let userKey = keysNames[i];

        if (account && account.getIn([userKey, 'key_auths']).size) {

            let findKey = account.getIn([userKey, 'key_auths']).find((keyArr) => {
                return keyArr.get(0) && keyArr.get(0) === publicKey;
            });

            if (findKey) {
                keys[userKey] = PrivateKey.fromWif(privateKeyWif);
            }
        }

    }

    let walletName = iDB.getCurrentWalletName(),
        brainKeyPrivate = keys.owner ? keys.owner : keys.active,
        brainKeyPublic = brainKeyPrivate.toPublicKey().toPublicKeyString(),
        brainKeyEncrypted = privateAesLocal.encryptToHex(brainKeyPrivate.toBuffer()),
        passwordPrivate = PrivateKey.fromSeed(privateKeyWif),
        passwordPublic = passwordPrivate.toPublicKey().toPublicKeyString(),
        date = new Date(),
        wallet = {
            public_name : walletName,
            password_pubkey : passwordPublic,
            encryption_key : encryptionKey,
            encrypted_brainkey : brainKeyEncrypted,
            brainkey_pubkey : brainKeyPublic,
            brainkey_sequence: 0,
            brainkey_backup_date : date,
            created: date,
            last_modified: date,
            chain_id: Apis.instance().chain_id
        };

    return WalletService.resetDBTables()
        .then(WalletService.saveKeysToDB(keys, privateAesLocal))
        .then(WalletService.saveWalletToDB(wallet))
        .then(WalletService.setCurrentWalletNameToDB(walletName))
        .then(() => {
            return wallet;
        });
  }


  /**
   * Reset iDB tables
   * @returns {*}
   */
  static resetDBTables() {
    let resetPromises = iDB.WALLET_BACKUP_STORES.map(table => {
      return iDB.reset_table(table)
    })

    return Promise.all(resetPromises)
  }

  /**
   * Save keys to iDB
   * @param keys
   * @param privateAesLocal
   */
  static saveKeysToDB(keys, privateAesLocal) {
    let objectKeys = [],
      objectHashKeys = {}

    Object.keys(keys).forEach(keyHash => {

      let private_key = keys[keyHash]

      let obj = {
        encrypted_key: privateAesLocal.encryptToHex(private_key.toBuffer()),
        pubkey: private_key.toPublicKey().toPublicKeyString(),
        type: keyHash,
      }

      objectKeys.push(obj)

      objectHashKeys[keyHash] = obj
    })

    let promises = []

    objectKeys.forEach(private_key_object => {
      let transaction = iDB
        .instance()
        .db()
        .transaction(['wallet', 'private_keys'], 'readwrite')

      promises.push(
        idb_helper
          .add(transaction.objectStore('private_keys'), private_key_object)
          .catch(event => {
            // ignore_duplicates
            let error = event.target.error
            console.log('... error', error, event)
          }),
      )
    })

    return Promise.all(promises).then(() => {
      return objectHashKeys
    })
  }

  /**
   * Save wallet to iDB
   * @param wallet
   * @returns {*}
   */
  static saveWalletToDB(wallet) {
    let transaction = iDB
        .instance()
        .db()
        .transaction(['wallet'], 'readwrite'),
      add = idb_helper.add(transaction.objectStore('wallet'), wallet),
      end = idb_helper.on_transaction_end(transaction)

    return Promise.all([add, end])
  }

  /**
   * Set Current Name into iDB
   * @param walletName
   * @returns {promise|void}
   */
  static setCurrentWalletNameToDB(walletName) {
    return iDB.root.setProperty('current_wallet', walletName)
  }

  /**
   * Get wallet from iDB
   * @returns {Promise}
   */
  static getDBWallet() {
    return new Promise(resolve => {
      return idb_helper.cursor('wallet', cursor => {
        if (!cursor) {
          return resolve()
        }

        return resolve(cursor.value)
      })
    })
  }

  /**
   * Get keys from iDB
   * @returns {Promise}
   */
  static getDBKeys() {
    return new Promise(resolve => {
      let keys = {}
      
      return idb_helper
        .cursor('private_keys', cursor => {
          if (!cursor) {
            return
          }

          keys[cursor.value.type] = cursor.value

          cursor.continue()
        })
        .then(() => {
          resolve(keys)
        })
    })
  }

  /**
   * Is there a wallet?
   * @return Promise
   */
  static checkEnableWallet() {
    return iDB.root.getProperty('current_wallet').then(current_wallet => {
      return !!current_wallet
    })
  }
}

export default WalletService
