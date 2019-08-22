import AsideReducer from 'reducers/AsideReducer';

import AccountChainRepository from 'repositories/AccountChainRepository';

import ChainService from 'services/ChainService';

export default class AsideActions {
    static showAside() {
        return dispatch => dispatch(AsideReducer.actions.showAside())
    }

    static hideAside() {
        return dispatch => dispatch(AsideReducer.actions.hideAside())
    }

    static setSweepAdditionalInfo(lotteryId) {
        return (dispatch, getState) => {

            const state = getState();
            let additionalLotteryInfo = state.sweeps.get('userLotteries').find(lottery => lottery.id === lotteryId);
            const lotteryIndex = state.sweeps.get('userLotteries').findIndex(lottery => lottery.id === lotteryId);
            const promises = additionalLotteryInfo.lottery_options.benefactors.map(benefactor => AccountChainRepository.getAccount(benefactor.id));

            return Promise.all(promises)
            .then(accounts => {

                return accounts.forEach((user, index) => additionalLotteryInfo.lottery_options.benefactors[index].name = user.get('name'));
            })
            .then(() => {

                additionalLotteryInfo =  {
                    ...additionalLotteryInfo,
                    ...state.sweeps.get('userLotteriesBlocksTime').get(lotteryIndex)
                };

                return additionalLotteryInfo;
            })
            .then(() => ChainService.getSoldTickets(additionalLotteryInfo.dynamic_asset_data_id))
            .then(totalSupply => {

                additionalLotteryInfo.ticketsSold = totalSupply;

                dispatch(AsideReducer.actions.setSweepAdvancedInfo(additionalLotteryInfo));
                dispatch(AsideReducer.actions.showAside());
            });
        };
    }

    static setTicketAdditionalInfo(lotteryId) {
        return (dispatch, getState) => {

            const state = getState();
            let additionalLotteryInfo = state.sweeps.get('userTickets').find(lottery => lottery.id === lotteryId);
            const lotteryIndex = state.sweeps.get('userTickets').findIndex(lottery => lottery.id === lotteryId);
            const promises = additionalLotteryInfo.lottery_options.benefactors.map(benefactor => AccountChainRepository.getAccount(benefactor.id));

            return Promise.all(promises)
            .then(accounts => {

                return accounts.forEach((user, index) => additionalLotteryInfo.lottery_options.benefactors[index].name = user.get('name'));
            })
            .then(() => {

                additionalLotteryInfo =  {
                    ...additionalLotteryInfo,
                    ...state.sweeps.get('userLotteriesBlocksTime').get(lotteryIndex)
                };

                return additionalLotteryInfo;
            })
            .then(() => ChainService.getSoldTickets(additionalLotteryInfo.dynamic_asset_data_id))
            .then(totalSupply => {

                additionalLotteryInfo.ticketsSold = totalSupply;

                dispatch(AsideReducer.actions.setSweepAdvancedInfo(additionalLotteryInfo));
                dispatch(AsideReducer.actions.showAside());
            });
        };
    }
}
