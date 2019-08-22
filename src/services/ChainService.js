import { ChainStore } from 'peerplaysjs-lib';
import moment from 'moment';
import Helper from '../components/Dashboard/Draws/Helper';

export default class ChainService {

    static getDateOfBlock(blockNumber) {

        return new Promise((resolve, reject) => {

            if (!blockNumber) {
                return resolve({
                    blockTime: null
                });
            }

            const object210 = ChainStore.getObject('2.1.0', false);
            const object200 = ChainStore.getObject('2.0.0', false);

            if (typeof object200 !== 'object' || typeof object210 !== 'object') {
                return setTimeout(() => ChainService.getDateOfBlock(blockNumber).then(resolve).catch(reject), 500);
            }

            const blockInterval = object200.getIn(['parameters', 'block_interval']);
            const headBlockNumber = object210.get('head_block_number');
            const headBlockTime = object210.get('time');

            resolve({
                blockTime: Number(moment.utc(headBlockTime).subtract((headBlockNumber - blockNumber) * blockInterval, 'second').format('x'))
            });
        });
    }

    static getBenefactors(bId) {
        return new Promise((resolve, reject) => {

            if (!bId) {
                return resolve();
            }

            const benefactorObj = ChainStore.getObject(bId, false);

            if (typeof benefactorObj !== 'object') {
                return setTimeout(() =>
                    ChainService.getBenefactors(bId)
                    .then(resolve)
                    .catch(reject), 500
                );
            }

            resolve(benefactorObj);
        });

    }

    static getDateOfBlockSync(blockNumber) {

        const object210 = ChainStore.getObject('2.1.0', false);
        const object200 = ChainStore.getObject('2.0.0', false);

        const blockInterval = object200.getIn(['parameters', 'block_interval']);
        const headBlockNumber = object210.get('head_block_number');
        const headBlockTime = object210.get('time');
    
        return (Number(moment.utc(headBlockTime).subtract((headBlockNumber - blockNumber) * blockInterval, 'second').format('x')));
    }

    static getCurrentLotterySupply(dynamicAssetDataId) {
        return new Promise((resolve, reject) => {

            const dynamicObject = ChainStore.getObject(dynamicAssetDataId, false);

            if (typeof dynamicObject !== 'object') {
                return setTimeout(() => ChainService.getCurrentLotterySupply(dynamicAssetDataId).then(resolve).catch(reject), 500);
            }

            resolve(dynamicObject.get('current_supply'));
        });
    }

    static getSoldTickets(dynamicAssetDataId) {
        return new Promise((resolve, reject) => {

            const dynamicObject = ChainStore.getObject(dynamicAssetDataId, false);

            if (typeof dynamicObject !== 'object') {
                return setTimeout(() => ChainService.getSoldTickets(dynamicAssetDataId).then(resolve).catch(reject), 500);
            }

            resolve(dynamicObject.get('sweeps_tickets_sold') || dynamicObject.get('current_supply'));
        });
    }

    static getLotterySymbol(lotteryId) {
        return new Promise((resolve, reject) => {

            if (!lotteryId) {
                return resolve();
            }

            const lotteryAsset = ChainStore.getObject(lotteryId, false);

            if (typeof lotteryAsset !== 'object') {
                return setTimeout(() =>
                    ChainService.getLotterySymbol(lotteryId)
                    .then(resolve)
                    .catch(reject), 500
                );
            }
        
            resolve(lotteryAsset.get('symbol') || 'PPY');
        });
    }

    static getLotteryDescription(lotteryId) {
        return new Promise((resolve, reject) => {

            if (!lotteryId) {
                return resolve();
            }

            const lotteryAsset = ChainStore.getObject(lotteryId, false);

            if (typeof lotteryAsset !== 'object') {
                return setTimeout(() =>
                    ChainService.getLotteryDescription(lotteryId)
                    .then(resolve)
                    .catch(reject), 500
                );
            }

            if (Helper.IsJsonString(lotteryAsset.getIn(['options', 'description']))) {
                return resolve(JSON.parse(lotteryAsset.getIn(['options', 'description'])).lottoName);
            } else {
                return resolve(lotteryAsset.getIn(['options', 'description']));
            }
        });
    }

    static getLotteryPrice(lotteryId) {
        return new Promise((resolve, reject) => {

            if (!lotteryId) {
                return resolve();
            }

            const lotteryAsset = ChainStore.getObject(lotteryId, false);

            if (typeof lotteryAsset !== 'object') {
                return setTimeout(() =>
                    ChainService.getLotterySymbol(lotteryId)
                    .then(resolve)
                    .catch(reject), 500
                );
            }

            resolve(lotteryAsset.getIn(['lottery_options', 'ticket_price', 'amount']));
        });
    }
}



