import { fromJS } from 'immutable';

import AccountHistoryReducer from 'reducers/AccountHistoryReducer';
import AccountChainRepository from 'repositories/AccountChainRepository';

import ChainService from 'services/ChainService';

export default class AccountHistoryActions {

    /**
     *
     * @param {String} setFilters
     * @return {function(*)}
     */
    static setFilters(filters) {
        return (dispatch) => {
            dispatch(AccountHistoryActions.setPage(1));
            dispatch(AccountHistoryReducer.actions.setFilters(filters));
        };
    }

    static resetFilters(filters) {
        return (dispatch) => {
            dispatch(AccountHistoryActions.setPage(1));
            dispatch(AccountHistoryReducer.actions.setFilters());
        };
    }


    static setDateFilter(dateString) {
        return dispatch => dispatch(AccountHistoryReducer.actions.setDateFilter(dateString));
    }

    static setPage(page) {
        return dispatch => dispatch(AccountHistoryReducer.actions.setPage(page));
    }

    static setPreviousPage(page) {
        return dispatch => dispatch(AccountHistoryReducer.actions.setPreviousPage(page));
    }

    static sortAccountHistory(field, direction, path) {
        return dispatch => dispatch(AccountHistoryReducer.actions.sortAccountHistory({
            field,
            direction,
            path
        }));
    }

    static filterByDate(date) {
        return dispatch => dispatch(AccountHistoryReducer.actions.filterByDate(date));
    }

    static setAccountHistory(dispatch, getState, history) {

        const accountId = getState().app.account.get('id');
        const previousHistory = getState().accountHistory.get('accountHistory');
        const previousHistoryBlocksTimeSize = getState().accountHistory.get('accountHistoryBlocksTime').size;
        const previousHistorySymbolsSize = getState().accountHistory.get('accountHistoryLotterySymbols').size;
        const previousHistoryPricesSize = getState().accountHistory.get('accountHistoryLotteryPrices').size;

        let newHistory;

        if (
            history &&
            history === previousHistory &&
            previousHistoryBlocksTimeSize &&
            previousHistorySymbolsSize &&
            previousHistoryPricesSize
        ) {
            return;
        }

        AccountChainRepository.getAccountHistory(accountId)
        .then(history => {

            if (history === previousHistory) {
                return Promise.reject();
            }

            newHistory = history;

            return Promise.all(history.toJS().map(tx => ChainService.getDateOfBlock(tx.block_num)));
        })
        .catch(() => Promise.reject())
        .then(dates => {

            if (!dates) {
                return Promise.resolve();
            }

            dispatch(
                AccountHistoryReducer.actions.setAccountHistoryBlocksTime(dates)
            );

            return Promise.all(newHistory.map(tx =>
                ChainService.getLotteryDescription(tx.getIn([
                    'op',
                    1,
                    'lottery'
                ]))
            ));
        })
        .then(lotterySymbols => {

            dispatch(
                AccountHistoryReducer.actions.setLotterySymbols(lotterySymbols)
            );

            return Promise.all(newHistory.map(tx =>
                ChainService.getLotteryPrice(tx.getIn([
                    'op',
                    1,
                    'lottery'
                ]))
            ));
        })
        .then(lotteryPrices => {

            dispatch(
                AccountHistoryReducer.actions.setLotteryPrices(lotteryPrices)
            );
            dispatch(AccountHistoryReducer.actions.setAccountHistory(newHistory));
        }).then(null,function(){});
    }

    static setFilteredHistoryLength(size) {
        return dispatch => dispatch(AccountHistoryReducer.actions.setFilteredHistoryLength(size));
    }

    static subscribeHistory() {
        return (dispatch, getState) => {
            window.sahRef = AccountHistoryActions.setAccountHistory.bind(this, dispatch, getState)
            AccountChainRepository.subscribeHistory(
                window.sahRef
            );
        };
    }

    static unsubscribeHistory() {
        return (dispatch, getState) => {
            AccountChainRepository.unsubscribeHistory(
                window.sahRef
            );
        };
    }
}
