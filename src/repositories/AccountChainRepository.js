import {
  ChainTypes,
  PrivateKey,
  key,
  ChainStore,
  Aes,
  TransactionHelper,
  FetchChain
} from 'peerplaysjs-lib';
import moment from 'moment';

import ChainService from 'services/ChainService';
import LotteryActions from '../actions/LotteryActions';
// import { CLIENT_RENEG_LIMIT } from 'tls';

const MAX_RECURSION_ATTEMPTS = 40;

class AccountChainRepository {
  /**
   *
   * @param accountIdOrName
   * @param numRecursion
   * @return {Promise}
   */
    static getAccount(accountIdOrName, numRecursion = 0) {
        return new Promise((resolve, reject) => {
            const fullAccount = ChainStore.getAccount(accountIdOrName);

            if (numRecursion > MAX_RECURSION_ATTEMPTS) {
                console.warn('[APP] MAX_RECURSION_ATTEMPTS Repository.getAccount()');
                return reject();
            }

            if (fullAccount === null) return reject();

            if (fullAccount) {
                return resolve(fullAccount);
            }

            setTimeout(() => {
                this.getAccount(accountIdOrName, ++numRecursion)
          .then(res => resolve(res))
          .catch(err => reject(err));
            }, 100);
        });
    }

    static getAccountBalance(fullAccount, assetType = '1.3.0') {
    // 1.3.0 = PPY
        return ChainStore.getAccountBalance(fullAccount, assetType);
    }

    static resetCache() {
        return ChainStore.resetCache();
    }

    static getAccountHistory(accountId) {
        return AccountChainRepository.getAccount(accountId).then(account =>
      account.get('history')
    );
    }

    static fetchLotteryWins(limit, benefactorFlag) { // fetch up to 100
        
        return ChainStore.fetchLotteryWins(limit, benefactorFlag);
    }

    static fetchLotteryWinsRecursive() { // fetches ALL
        
        return LotteryActions.getWinnersRecursively(null, null);

        
    }

    static fetchLotteryWinsSorted(limit, benefactorFlag) {
        return AccountChainRepository.fetchLotteryWins(limit, benefactorFlag).then(response => {
            return response.sort((a, b) => b.amount < a.amount);
        });
    }

    static fetchTotalWinnings(limit, benefactorFlag, user) {
        return AccountChainRepository.fetchLotteryWins(limit, benefactorFlag).then(response => {
            return response.reduce((a, b) => {
                if (!user) {
                    return a + b.amount;
                } else if (b.name == user) {
                    return a + b.amount;
                } return a;
                
            }, 0);
        });
    }

    static fetchRecentHistory(accountId) {
        return ChainStore.fetchRecentHistory(accountId);
    }

    static subscribeHistory(cb) {
        ChainStore.subscribe(cb);
    }

    static unsubscribeHistory(cb) {
        ChainStore.unsubscribe(cb);
    }
}

export default AccountChainRepository;
