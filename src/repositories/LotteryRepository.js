import { Apis, ChainStore, PrivateKey, key, Aes, hash, FetchChain, TransactionBuilder } from 'peerplaysjs-lib';
import moment from 'moment';

import StorageService from 'services/StorageService';
import ChainService from 'services/ChainService';

export default class LotteryRepository {

    static createNewLottery(lotteryParams, state) {
        return new Promise((resolve, reject) => {
            debugger;
            const pubKeys = Object.values(state.app.keys).map(key => key.pubkey);
            let transaction = new TransactionBuilder();

            transaction.add_type_operation('lottery_asset_create', lotteryParams);

            transaction.set_required_fees().then(() => {
                transaction.get_required_signatures(pubKeys).then(requiredPubKeys => {

                    const { encrypted_key, pubkey } = Object.values(state.app.keys).find(key => key.pubkey === requiredPubKeys[0]);
                    const passwordAes = Aes.fromSeed(StorageService.getEncryption());
                    const encryptionPlainbuffer = passwordAes.decryptHexToBuffer(encrypted_key);
                    const privateKey = PrivateKey.fromBuffer(encryptionPlainbuffer);

                    transaction.add_signer(privateKey, pubkey);

                    transaction
                    .broadcast(() => resolve())
                    .catch(error => reject(error.message.split(',')[0]));
                });
            });
        });
    }

    static buyLotteryTickets(lotteryParams, keys) {
        return new Promise((resolve, reject) => {

            const pubKeys = Object.values(keys).map(key => key.pubkey);
            let transaction = new TransactionBuilder();

            transaction.add_type_operation('ticket_purchase', lotteryParams);

            transaction.set_required_fees().then(() => {
                transaction.get_required_signatures(pubKeys).then(requiredPubKeys => {

                    const { encrypted_key, pubkey } = Object.values(keys).find(key => key.pubkey === requiredPubKeys[0]);
                    const passwordAes = Aes.fromSeed(StorageService.getEncryption());
                    const encryptionPlainbuffer = passwordAes.decryptHexToBuffer(encrypted_key);
                    const privateKey = PrivateKey.fromBuffer(encryptionPlainbuffer);

                    transaction.add_signer(privateKey, pubkey);

                    transaction
                        .broadcast(() => resolve())
                        .catch(error => reject(error.message.split(',')[0]));
                });
            });
        });
    }

    static getUserLotteries(accountId) {
        return Apis.instance().db_api()
            .exec('get_account_lotteries', [accountId, '1.3.0', 100, '1.3.0'])
    }

    static subscribeUserLotteries(cb) {
        ChainStore.subscribe(cb);
    }

    static unsubscribeUserLotteries(cb) {
        ChainStore.unsubscribe(cb);
    }

    static subscribeUserTickets(cb) {
        ChainStore.subscribe(cb);
    }

    static unsubscribeUserTickets(cb) {
        ChainStore.unsubscribe(cb);
    }
}